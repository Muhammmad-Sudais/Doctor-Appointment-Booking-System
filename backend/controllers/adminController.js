import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    // Check for all required fields
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !imageFile
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    // Parse address safely
    let parsedAddress;
    try {
      parsedAddress = JSON.parse(address);
    } catch (err) {
      return res.json({ success: false, message: "Invalid address format" });
    }

    // Prepare doctor data
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: parsedAddress,
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email, isAdmin: true }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api get all doctor list at admin panel

const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password')
    res.json({ success: true, doctors })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// api to get all appointment list

const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({})
      .populate('docId', 'name image speciality')
      .populate('userId', 'name image dob')
      .sort({ date: -1 })

    // Map to include docData and userData
    const formattedAppointments = appointments.map(apt => ({
      ...apt.toObject(),
      docData: apt.docId,
      userData: apt.userId
    }))

    res.json({ success: true, appointments: formattedAppointments })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// api for appointment cancellation
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    console.log('Cancelling appointment:', { appointmentId });

    // Find the appointment first
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Check if already cancelled
    if (appointmentData.cancelled) {
      return res.json({ success: false, message: "Appointment is already cancelled" });
    }

    // Releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;

    console.log('Releasing slot:', { docId, slotDate, slotTime });

    // Use MongoDB $pull operator to remove the slot from the array
    const updateResult = await doctorModel.findByIdAndUpdate(
      docId,
      {
        $pull: {
          [`slots_booked.${slotDate}`]: slotTime
        }
      }
    );

    if (!updateResult) {
      console.log('Doctor not found or update failed');
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Clean up empty date arrays
    const doctorAfterUpdate = await doctorModel.findById(docId);
    if (doctorAfterUpdate.slots_booked &&
      doctorAfterUpdate.slots_booked[slotDate] &&
      doctorAfterUpdate.slots_booked[slotDate].length === 0) {

      await doctorModel.findByIdAndUpdate(
        docId,
        {
          $unset: {
            [`slots_booked.${slotDate}`]: ""
          }
        }
      );
    }

    // Update appointment to cancelled (KEEP THE RECORD)
    await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { cancelled: true, cancelledAt: new Date() }
    );

    console.log('Appointment marked as cancelled');

    res.json({ success: true, message: "Appointment Cancelled Successfully" });

  } catch (error) {
    console.log('Error in cancelAppointment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// api for appointment completion
const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    console.log('Completing appointment:', { appointmentId });

    // Find the appointment first
    const appointmentData = await appointmentModel.findById(appointmentId)
      .populate('docId', 'fees');

    if (!appointmentData) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Check if already cancelled or completed
    if (appointmentData.cancelled) {
      return res.json({ success: false, message: "Cannot complete cancelled appointment" });
    }

    if (appointmentData.isCompleted) {
      return res.json({ success: false, message: "Appointment is already completed" });
    }

    // Update appointment to completed
    await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { 
        isCompleted: true, 
        completedAt: new Date(),
        amount: appointmentData.docId.fees // Add the doctor's fee as amount
      }
    );

    console.log('Appointment marked as completed');

    res.json({ success: true, message: "Appointment Completed Successfully" });

  } catch (error) {
    console.log('Error in appointmentComplete:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// to get dashboard data for the admin panel

const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointments = await appointmentModel.find({})
      .populate('docId', 'name image speciality')
      .populate('userId', 'name image')
      .sort({ date: -1 })
      .limit(5)

    // Calculate total earnings from completed appointments
    const completedAppointments = await appointmentModel.find({ isCompleted: true, cancelled: false });
    const totalEarnings = completedAppointments.reduce((total, apt) => {
      return total + (apt.amount || apt.docId?.fees || 0);
    }, 0);

    const dashData = {
      doctors: doctors.length,
      appointments: await appointmentModel.countDocuments(),
      patients: users.length,
      earnings: totalEarnings,
      latestAppointments: appointments.map(apt => ({
        ...apt.toObject(),
        docData: apt.docId,
        userData: apt.userId
      }))
    }

    res.json({ success: true, dashData })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, appointmentComplete, adminDashboard };