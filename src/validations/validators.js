const isEditAllowed = (req) => {
    const allowed = ["emailId", "firstName", "lastName", "skills"];
    return Object.keys(req.body).every(key => allowed.includes(key));
};

module.exports=isEditAllowed;