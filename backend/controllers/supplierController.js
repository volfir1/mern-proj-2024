import Supplier from "../models/supplier.js";
import Category from "../models/category.js"

export const createSupplier = async (req, res) =>{
    try{
        const {name, email, phone, address, categoryID, description} = req.body;

        const category = await Category.findById(categoryID);
        if(!category){
            return res.status(400).json({message: "Invalid Category"})
        }

        const supplier = new Supplier({
            name,
            email,
            phone,
            address,
            category: categoryID,
            description       
         }) 
         await supplier.save();
         res.status(201).json(supplier)

    }catch(error){
        req.status(400).json({message: error.message})
    }
    
}

export const getSuppliers = async (req,res) =>{
   try{
    const suppliers =await Supplier.find().populate('category','name')
        res.json(suppliers);
   }catch(error){
    res.status(500).json({message: error.message});
   }
};

export const getSupplierByID = async (req, res) => {
    try{
        const supplier = await Supplier.findById(req.params.id).populate('category','name')
        if(!supplier){
                return res.status(404).json({message: "Supplier not found"})
        }
        res.json(supplier)
    }catch(error){
        res.status(500).json({message: error.message})
    }
}


//Update Supplier
export const updateSupplier = async (req,res)=>{
    try{
        const{name, email, phone, address, categoryID, description, active}=req.body

        if(categoryID){
            const category = await Category.findbyID(categoryID)
            if(!category){
                return res.status(400).json({message:"Invalid Category"})
            }
        }

        const updatedSupplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            {name, email,phone,address,category:categoryID, description, active},
            {new:true, runValidators: true}
        )

        if (!updateSupplier){
            return res.status(404).json({message: "Supplier not found"})
        }
        res.josn(updatedSupplier)
    }catch(error){
        res.status(400).json({message: error.message})
    }
}



//Delete
export const deleteSupplier = async(req, res)=>{
    try{
        const supplier = await Supplier.findByIdAndDelete(req.params.id)
        if(!supplier){
            return res.status(404).json({message: "Supplier not found"})
        }
        res.join({mesage: "Supplier deleted Successfuly"})
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

