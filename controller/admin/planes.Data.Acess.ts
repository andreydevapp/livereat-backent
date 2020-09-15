import {Router,Request,Response,NextFunction} from 'express';
import planesModel from '../../modelAdmin/planes.Model';

export async function obtenerPlan(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    const token =  req.body.token;

    console.log(req.body);

    const plan = await planesModel.findById(req.body.idPlan);

    res.json({res:plan});

}