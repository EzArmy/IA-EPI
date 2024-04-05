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

        const gestorFolder = './public/uploads/' + req.session.user.id;

        if (!fs.existsSync(gestorFolder)) {
            fs.mkdirSync(gestorFolder, { recursive: true });
        }

        console.log("Destination path:", gestorFolder);

        cb(null, gestorFolder);
    },
    filename: (req, file, cb) => {
        const fileName = path.basename(file.originalname)
        cb(null, fileName);
    }
});

const editGestorUpload = multer({
    storage: gestorFotoStorage
});

/// ROTAS /////////////////////////////////////////

router.get('/', async (req, res) => {

    const gestorInfo = req.session.user;
    const listaSetores = await Setor.findAll();
    const listaCargos = await Cargo.findAll({
        where: {
            nivel: 1
        }
    });

    let imagePath = gestorInfo && gestorInfo.foto ? `/uploads/${gestorInfo.id}/${gestorInfo.foto}` : '';

    // Se imagePath for null ou vazio, define a imagem padrão
    imagePath = imagePath || '/images/profile/default.jpg';

    res.render('editGestor.ejs', {
        error: null,
        listaSetores: listaSetores,
        listaCargos: listaCargos,
        gestorInfo: gestorInfo,
        imagePath
    });
});

//Rota para editar o perfil do gestor
router.post('/gestorUpdate', editGestorUpload.single('gestorFoto'), async (req, res) => {

    const {
        gestorNome,
        gestorEmail,
        gestorSenha,
        idSetor: gestorSetor,
        idCargo: gestorCargo
    } = req.body;

    const gestorInfo = req.session.user;

    const gestorFoto = req.file ? req.file.filename : gestorInfo.foto;

    try {
        await Gestor.update({
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
    } catch (error) {
        console.error('Erro ao atualizar informações do gestor:', error);
        return res.redirect('/home/perfilGestor');
    }

    // Atualiza os dados do gestor na sessão
    req.session.user = {
        ...req.session.user,
        nome: gestorNome,
        email: gestorEmail,
        foto: gestorFoto
    };

    res.redirect('/home/perfilGestor');
});

//Rota para deletar o usuário do gestor junto de tudo que está vinculado a ele
router.post('/delete', async (req, res) => {
    const gestorInfo = req.session.user;

    try {
        // Deletar o gestor do banco de dados
        await Gestor.destroy({
            where: {
                id: gestorInfo.id
            }
        });

        // Excluir a pasta do gestor
        const pastaGestor = './public/uploads/' + gestorInfo.id;
        if (fs.existsSync(pastaGestor)) {
            fs.rmdirSync(pastaGestor, { recursive: true });
        }

        // Redirecionar para alguma página após a exclusão
        res.redirect('/');
    } catch (error) {
        console.error('Erro ao deletar gestor:', error);
        res.redirect('/home/perfilGestor');
    }
});

module.exports = router;