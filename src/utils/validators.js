const isEditAllowed = (req) => {
    const allowed = ["emailId", "firstName", "lastName", "skills","about","photoURL","age","gender"];
    return Object.keys(req.body).every(key => allowed.includes(key));
};

module.exports=isEditAllowed;