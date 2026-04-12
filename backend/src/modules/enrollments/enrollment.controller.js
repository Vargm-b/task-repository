const{joinClass} = require('./enrollment.service');

async function handleJoinClass(req,res){
    try {
        const{access_code, student_id} = req.body;
        const enrollment =await joinClass({access_code, student_id});
        return res.status(201).json(enrollment);
    }catch(error){
        console.error('error al unirse a la  clase', error.message);
        return res.status(400).json({error: error.message});
    }
}

module.exports = {handleJoinClass};