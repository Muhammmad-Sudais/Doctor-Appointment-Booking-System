import mongoose from 'mongoose';
import doctorModel from './models/doctorModel.js';
import appointmentModel from './models/appointmentModel.js';
import 'dotenv/config';

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`);
        console.log("DB Connected");
    } catch (error) {
        console.error("DB Connection Error:", error);
        process.exit(1);
    }
};

const cleanupSlots = async () => {
    await connectDB();

    try {
        const doctors = await doctorModel.find({});
        let cleanedCount = 0;

        console.log(`Checking ${doctors.length} doctors for phantom slots...`);

        for (const doctor of doctors) {
            const slots_booked = doctor.slots_booked || {};
            let isModified = false;

            for (const date in slots_booked) {
                const slots = slots_booked[date];
                const validSlots = [];

                for (const time of slots) {
                    // Check if there is an active appointment for this slot
                    const appointment = await appointmentModel.findOne({
                        docId: doctor._id,
                        slotDate: date,
                        slotTime: time,
                        cancelled: false
                    });

                    if (appointment) {
                        validSlots.push(time);
                    } else {
                        console.log(`Removing phantom slot: Doctor ${doctor.name}, Date ${date}, Time ${time}`);
                        isModified = true;
                        cleanedCount++;
                    }
                }

                if (validSlots.length !== slots.length) {
                    if (validSlots.length > 0) {
                        slots_booked[date] = validSlots;
                    } else {
                        delete slots_booked[date];
                    }
                    isModified = true;
                }
            }

            if (isModified) {
                // We need to mark the field as modified because it's a Mixed type or nested object
                doctor.markModified('slots_booked');
                await doctor.save();
                // Or use findByIdAndUpdate with the new object, but save() with markModified is safer for Mixed types
            }
        }

        console.log(`Cleanup complete. Removed ${cleanedCount} phantom slots.`);
        process.exit(0);

    } catch (error) {
        console.error("Cleanup Error:", error);
        process.exit(1);
    }
};

cleanupSlots();
