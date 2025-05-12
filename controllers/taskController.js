const taskModel = require("../models/taskModel");

const addTask = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);

    const {dueDate, ...restData} = req.body;
    const formattedDueDate = new Date(dueDate).toISOString().split("T")[0];

    const task = await taskModel.create({...restData, userId: userId, dueDate:formattedDueDate});
    res.status(200).json({
      message: "Task Added",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

const getAllTaskByUserId = async (req, res) => {
  try {
    const userId = req.user._id;

    const {sortBy} = req.query;

    let sortOptions = {};
    if(sortBy === 'priority'){
      sortOptions = { priority: 1};  
    }
    else if(sortBy === 'status'){
      sortOptions = { status: -1};
    }
    else if(sortBy === 'dueDate'){
      sortOptions = { dueDate : 1};
    }
    else{
      sortOptions = { createdAt: -1 }; // Default: Newest first
    }

    const response = await taskModel.find({ userId }).sort(sortOptions);
    
    if(sortBy === 'priority'){
      response.sort((a,b)=>{
        const priorityWeights = {'High': 1, 'Medium': 2, 'Low': 3};
        return priorityWeights[a.priority] - priorityWeights[b.priority];
      })
    }


    if (response.length === 0) {
      return res.status(404).json({
        message: "No Task Founds",
      });
    } else {
      res.status(200).json({
        message: "Taskss fetched successfully",
        data: response,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

const getTaskByTaskId = async(req,res) => {
  try{
    const taskId = req.params.id;
    const task = await taskModel.findById(taskId);

    if(!task){
      return res.status(404).json({
        message: "Task Not Found"
      })
    }

    return res.status(200).json({ data: task });

  }catch(error){

    return res.status(500).json({ message: error.message });
  
  }
}

const updateTaskByUserId = async (req, res) => {
  try {
    const taskId = req.params.id;
    // const oldTask = await taskModel.findById(taskId);
    const updatedTaskData = req.body;
    const updatedTask = await taskModel.findByIdAndUpdate(taskId,updatedTaskData,{
            new: true,  //return updated document
            runValidators: true,    //run mongoose validation
    });

    if(!updatedTask){
        return res.status(404).json({error:"Task not found"});
    }

    res.status(200).json({
      message: "Tasks Updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

const deleteTaskByUserId = async (req, res) => {
  try {
    const taskId = req.params.id;
    console.log(taskId);
    
    const deletedTask = await taskModel.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task Not Found",
      });
    }

    return res.status(200).json({
      message: "Tasks deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

module.exports = {
  addTask,
  getAllTaskByUserId,
  updateTaskByUserId,
  deleteTaskByUserId,
  getTaskByTaskId
};
