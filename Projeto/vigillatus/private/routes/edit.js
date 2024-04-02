const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path')

//Module import
const Cargo = require('../module/Cargo');
const Setor = require('../module/Setor');
const Gestor = require('../module/Gestor')

/// CONFIGURAÇÕES /////////////////////////////////////////

const gestorFotoStorage = multer.diskStorage({
    destination:(req, file, cb)=>{
        const gestorFolder = './public/uploads/' + req.session.user.nome;
        cb(null, gestorFolder);
    },
    filename:(req,file,cb)=>{
        const fileName = path.basename(file.originalname)
        cb(null, fileName);
    }
});

const editGestorUpload = multer({
    storage:gestorFotoStorage
})

/// ROTAS /////////////////////////////////////////

router.get('/', async (req, res)=>{

    const gestorInfo = req.session.user;
    const listaSetores = await Setor.findAll();
    const listaCargos = await Cargo.findAll({
        where:{
            nivel: 1
        }
    });

    res.render('editGestor.ejs',{
        error:null,
        listaSetores:listaSetores,
        listaCargos:listaCargos,
        gestorInfo:gestorInfo
    });
});

router.post('/confirmEdit', editGestorUpload.single('gestorFoto'), async (req, res)=>{

    const{
        gestorNome,
        gestorEmail,
        gestorSenha,
        gestorSetor,
        gestorCargo
    } = req.body;

    const gestorFoto = req.file.filename;

    const gestorInfo = req.session.user;

    const editGestor = await Gestor.update({
        nome:gestorNome,
        email:gestorEmail,
        senha:gestorSenha,
        foto: gestorFoto,
        gestorSetor,
        gestorCargo
    },{
        where:{
            id: gestorInfo.id
        }
    });

    res.redirect('/home/perfilGestor');
});

module.exports = router;