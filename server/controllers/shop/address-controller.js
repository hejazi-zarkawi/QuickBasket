import Address from "../../models/Address.js";

export const addAddress = async (req, res) => {
    try {
        const { userId, address, city, pincode, phone, notes } = req.body;

        if (!userId || !address || !city || !pincode || !phone || !notes) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields!",
            });
        }

        const newlyCreatedAddress = new Address({
            userId,
            address,
            city,
            pincode,
            notes,
            phone,
        });

        await newlyCreatedAddress.save();

        return res.status(201).json({
            success: true,
            data: newlyCreatedAddress,
            message: "Address added successfully",
        });
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error while adding the address"
        })
    }
}

export const fetchAllAddress = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User id is required!",
            });
        }

        const addressList = await Address.find({ userId });

        return res.status(200).json({
            success: true,
            data: addressList,
            message: "Address fetched successfully",
        });
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching the address"
        })
    }
}

export const editAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;
        const formData = req.body;

        if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: "User and address id is required!",
            });
        }

        const address = await Address.findOneAndUpdate(
            {
                _id: addressId,
                userId,
            },
            formData,
            { new: true }
        );

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: address,
            message: " Address updated successfully"
        });
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error while updating the address"
        })
    }
}

export const deleteAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;
        if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: "User and address id is required!",
            });
        }

        const address = await Address.findOneAndDelete({ _id: addressId, userId });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Address deleted successfully",
        });
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error while deleting the address"
        })
    }
}