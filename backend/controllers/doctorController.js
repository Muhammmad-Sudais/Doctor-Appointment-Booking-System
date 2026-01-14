import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import appointmentModel from "../models/appointmentModel.js";

const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body;

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availability Changed' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// API doctor login
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// API to get doctor appointment for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {
        const docId = req.docId;

        if (!docId) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }

        const appointments = await appointmentModel.find({ docId })
            .populate('userId', 'name email phone image dob')
            .sort({ createdAt: -1 });

        res.json({ success: true, appointments });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const docId = req.docId;

        console.log('Complete appointment request:', { docId, appointmentId });

        // First, get the appointment to retrieve slot details
        const appointmentData = await appointmentModel.findOne({
            _id: appointmentId,
            docId: docId
        });

        if (!appointmentData) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found or not authorized"
            });
        }

        // Release the doctor slot
        const { slotDate, slotTime } = appointmentData;

        await doctorModel.findByIdAndUpdate(
            docId,
            {
                $pull: {
                    [`slots_booked.${slotDate}`]: slotTime
                }
            }
        );

        // Update appointment to completed
        const updatedAppointment = await appointmentModel.findByIdAndUpdate(
            appointmentId,
            {
                isCompleted: true
            },
            {
                new: true,
                populate: 'userId'
            }
        );

        console.log('Appointment completed successfully:', updatedAppointment);

        return res.json({
            success: true,
            message: 'Appointment marked as completed successfully',
            appointment: updatedAppointment
        });

    } catch (error) {
        console.log('Error completing appointment:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const docId = req.docId;

        console.log('Cancel appointment request:', { docId, appointmentId });

        // First, get the appointment to retrieve slot details
        const appointmentData = await appointmentModel.findOne({
            _id: appointmentId,
            docId: docId
        });

        if (!appointmentData) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found or not authorized"
            });
        }

        // Release the doctor slot
        const { slotDate, slotTime } = appointmentData;

        await doctorModel.findByIdAndUpdate(
            docId,
            {
                $pull: {
                    [`slots_booked.${slotDate}`]: slotTime
                }
            }
        );

        // Update appointment to cancelled
        const updatedAppointment = await appointmentModel.findByIdAndUpdate(
            appointmentId,
            {
                cancelled: true,
                isCompleted: false
            },
            {
                new: true,
                populate: 'userId'
            }
        );

        console.log('Appointment cancelled successfully:', updatedAppointment);

        return res.json({
            success: true,
            message: 'Appointment cancelled successfully',
            appointment: updatedAppointment
        });

    } catch (error) {
        console.log('Error cancelling appointment:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {
        const docId = req.docId

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.paymentStatus === 'paid') {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for Doctor Panel
const doctorProfile = async (req, res) => {
    try {
        const docId = req.docId
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile data from Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {
        const docId = req.docId
        const { fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    changeAvailability,
    doctorList,
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile
}