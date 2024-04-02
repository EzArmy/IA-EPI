const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//Module import
const Cargo = require('../module/Cargo');
const Setor = require('../module/Setor');
const Gestor = require('../module/Gestor')

/// CONFIGURAÇÕES /////////////////////////////////////////

const gestorFotoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const gestorFolder = './public/uploads/' + req.session.user.nome;
        cb(null, gestorFolder);
    },
    filename: (req, file, cb) => {
        const fileName = path.basename(file.originalname)
        cb(null, fileName);
    }
});

const editGestorUpload = multer({
    storage: gestorFotoStorage
})

/// ROTAS /////////////////////////////////////////

router.get('/', async (req, res) => {

    const gestorInfo = req.session.user;
    const listaSetores = await Setor.findAll();
    const listaCargos = await Cargo.findAll({
        where: {
            nivel: 1
        }
    });

    res.render('editGestor.ejs', {
        error: null,
        listaSetores: listaSetores,
        listaCargos: listaCargos,
        gestorInfo: gestorInfo
    });
});

router.post('/confirmEdit', editGestorUpload.single('gestorFoto'), async (req, res) => {

    const {
        gestorNome,
        gestorEmail,
        gestorSenha,
        idSetor: gestorSetor,
        idCargo: gestorCargo
    } = req.body;

    const gestorInfo = req.session.user;

    const gestorFoto = req.file ? req.file.filename : gestorInfo.foto;

    //Variáveis para armazenar os nomes das pastas casdo tenha sido editada ou não
    const oldGestorFolder = `./public/uploads/${gestorInfo.nome}`;
    const newGestorFolder = `./public/uploads/${gestorNome}`;

    //Verifica a alteração no nome do gestor

    if(gestorInfo.nome == gestorNome){
        console.log('Não é necessário alterar o nome da pasta do usuário ' + gestorInfo.nome);
    }else{
        fs.renameSync(oldGestorFolder, newGestorFolder);
    }

    const editGestor = await Gestor.update({
        nome: gestorNome,
        email: gestorEmail,
        senha: gestorSenha,
        foto: gestorFoto,
        gestorSetor,
        gestorCargo
    }, {
        where: {
            id: gestorInfo.id
        }
    });

    // Atualiza os dados do gestor na sessão
    req.session.user = {
        ...req.session.user,
        nome: gestorNome,
        email: gestorEmail,
        foto: gestorFoto
        // Adicione outros campos da sessão, se necessário
    };

    res.redirect('/home/perfilGestor');
});

module.exports = router;