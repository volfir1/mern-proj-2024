    import mongoose from "mongoose";

    const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    }, {
    timestamps: true,
    });

    // Middleware to update the updatedAt field before saving
    supplierSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
    });

    const Supplier = mongoose.model("Supplier", supplierSchema);

    export default Supplier;    