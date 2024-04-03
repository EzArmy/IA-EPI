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

    let erroRenomeacao = false;

    // Renomear a pasta do gestor, se o nome foi alterado
    if (gestorInfo.nome !== gestorNome) {
        const oldGestorFolder = `./public/uploads/${gestorInfo.nome}`;
        const newGestorFolder = `./public/uploads/${gestorNome}`;

        try {
            // Verifica se a pasta existe antes de renomear
            if (fs.existsSync(oldGestorFolder)) {
                fs.renameSync(oldGestorFolder, newGestorFolder);
            }
        } catch (err) {
            console.error('Erro ao renomear a pasta do gestor:', err);
            erroRenomeacao = true;
        }
    }

    if (erroRenomeacao) {
        // Se ocorreu um erro ao renomear, redirecione de volta à página de perfil do gestor
        return res.redirect('/home/perfilGestor');
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
    }; 

    res.redirect('/home/perfilGestor');
});


module.exports = router;