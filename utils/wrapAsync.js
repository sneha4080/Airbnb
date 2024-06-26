module.exports = (fn)=>{
    return (req,res,next)  => {
             fn(req,res,next).catch(next);
    };
};//require into app.js