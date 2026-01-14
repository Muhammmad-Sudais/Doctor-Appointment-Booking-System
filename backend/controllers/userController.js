import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import Razorpay from 'razorpay'

// api to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !password || !email) {
      return res.json({ success: false, message: "Missing Details" })
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "enter a valid email" })
    }
    // validating strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "enter a strong password" })
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const userData = {
      name,
      email,
      password: hashedPassword
    }

    const newUser = new userModel(userData)
    const user = await newUser.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    res.json({ success: true, token })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// api for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: 'User does not exist' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: "Invalid credentials" })
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// api to get user profile data
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const userData = await userModel.findById(userId).select("-password");

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// api to update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    const userId = req.user.id;

    if (!name || !phone || !address || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    // Parse address if it's a string
    const parsedAddress = typeof address === "string" ? JSON.parse(address) : address;

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender,
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });

      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// api to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime, userData, docData, amount } = req.body;

    // Validate all required fields
    if (!userId || !docId || !slotDate || !slotTime || !userData || !docData) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: userId, docId, slotDate, slotTime, userData, docData"
      });
    }

    const docDataFromDB = await doctorModel.findById(docId).select('-password');

    if (!docDataFromDB) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    if (!docDataFromDB.available) {
      return res.json({ success: false, message: "Doctor Not Available" });
    }

    let slots_booked = docDataFromDB.slots_booked || {};

    // Check for slot availability
    if (slots_booked[slotDate] && slots_booked[slotDate].includes(slotTime)) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked. Please choose another time."
      });
    }

    const userDataFromDB = await userModel.findById(userId).select('-password');

    if (!userDataFromDB) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Create appointment data with all required fields
    const appointmentData = {
      userId: userId,
      docId: docId,
      userData: userData,
      docData: docData,
      amount: amount || docDataFromDB.fees,
      slotTime: slotTime,
      slotDate: slotDate,
      date: new Date(),
      cancelled: false
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Update doctor's booked slots
    if (slots_booked[slotDate]) {
      // If date exists, push to existing array
      await doctorModel.findByIdAndUpdate(
        docId,
        {
          $push: {
            [`slots_booked.${slotDate}`]: slotTime
          }
        }
      );
    } else {
      // If date doesn't exist, create new array
      await doctorModel.findByIdAndUpdate(
        docId,
        {
          $set: {
            [`slots_booked.${slotDate}`]: [slotTime]
          }
        }
      );
    }

    res.json({
      success: true,
      message: "Appointment Booked Successfully",
      appointmentId: newAppointment._id
    });

  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// api to get user appointment for frontend my appointment page
const listAppointment = async (req, res) => {
  try {
    const userId = req.user.id;

    const appointments = await appointmentModel.find({ userId: userId })
      .populate('docId', 'name email speciality degree experience fees image')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      appointments
    });

  } catch (error) {
    console.error('List appointments error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// api to cancel appointments
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.user.id;

    console.log('Cancelling appointment:', { appointmentId, userId });

    // Find the appointment first
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // verify appointment user
    if (appointmentData.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized action' });
    }

    // Check if already cancelled
    if (appointmentData.cancelled) {
      return res.json({ success: false, message: "Appointment is already cancelled" });
    }

    // releasing doctor slot
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

    // Update appointment to cancelled
    await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { cancelled: true, cancelledAt: new Date() }
    );

    res.json({ success: true, message: "Appointment Cancelled Successfully" });

  } catch (error) {
    console.log('Error in cancelAppointment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// API to check slot availability
const checkSlotAvailability = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;

    if (!docId || !slotDate || !slotTime) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID, date and time are required"
      });
    }

    const doctor = await doctorModel.findById(docId);

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const slots_booked = doctor.slots_booked || {};
    const isSlotAvailable = !(slots_booked[slotDate] && slots_booked[slotDate].includes(slotTime));

    res.json({
      success: true,
      available: isSlotAvailable,
      message: isSlotAvailable ? "Slot is available" : "Slot is already booked"
    });

  } catch (error) {
    console.log('Error checking slot availability:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: "Appointment Cancelled or not found" })
    }

    // creating options for razorpay payment
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    }

    // creation of an order
    const order = await razorpayInstance.orders.create(options)

    res.json({ success: true, order })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

    if (orderInfo.status === 'paid') {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { paymentStatus: "paid" })
      res.json({ success: true, message: "Payment Successful" })
    } else {
      res.json({ success: false, message: "Payment Failed" })
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  checkSlotAvailability,
  paymentRazorpay,
  verifyRazorpay
}