const Jobs = require("../models/Job");
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require("../errors");
const notFound = require("../middleware/not-found");

const getAllJobs = async (req,res) => {
    try {
        const {id} = req.user
        const jobs = await Jobs.find({createdBy: id}).sort('createdAt')
        res.status(StatusCodes.OK).json({count: jobs.length, jobs})
    } catch (error) {
        throw new BadRequestError()
    }
}

const getJob = async (req,res) => {
    const {params:{id:userId}, user:{id: jobsId} } = req;
    const job = await Jobs.find({_id: userId, createdBy: jobsId})
    if(!job || job.lenght < 1){
        throw new NotFoundError("No jobs with id")
    }
    res.status(StatusCodes.OK).json({job})
}

const createJob = async (req,res) => {
    const {company, position, createdBy} = req.body;
    const {id} = req.user

    const job = await Jobs.create({company, position, createdBy: id })
    res.status(StatusCodes.CREATED).json(job)
}

const updateJob = async (req,res) => {
    const {params:{id:userId}, user:{id: jobsId}, body: {company, position} } = req;
    if(!position || !company){
        throw new BadRequestError("please input company and position")
    }
    const job = await Jobs.findOneAndUpdate({_id: userId, createdBy: jobsId}, req.body, {new:true, runValidators:true})
    if(!job){
        throw new NotFoundError(`No jobs with id ${userId}`)
    }
    res.status(StatusCodes.OK).json({job})
}

const deleteJob = async (req,res) => {
    try {
        const {params:{id:userId}, user:{id: jobsId}, body: {company, position} } = req;
        const remove = await Jobs.findOneAndDelete({_id: userId, createdBy: jobsId})
        if(!remove){
            throw new NotFoundError("No jobs with that id")
        }
        res.status(StatusCodes.OK).send(`No jobs with id ${userId}`)
    } catch (error) {
       throw new BadRequestError("Bad Request") 
    }
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}