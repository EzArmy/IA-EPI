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

// Primeira etapa: armazenar a nova imagem do perfil do gestor em um local temporário
const gestorFotoStorageTemp = multer.diskStorage({
    destination: (req, file, cb) => {
        // Use um diretório temporário para armazenar a imagem
        const tempFolder = './public/uploads/temp';
        cb(null, tempFolder);
    },
    filename: (req, file, cb) => {
        const fileName = path.basename(file.originalname)
        cb(null, fileName);
    }
});

const uploadTemp = multer({
    storage: gestorFotoStorageTemp
}).single('gestorFoto');

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

router.post('/confirmEdit', async (req, res) => {
    uploadTemp(req, res, async (err) => {
        if (err) {
            console.error('Erro ao fazer upload da imagem temporária:', err);
            return res.redirect('/home/perfilGestor');
        }

        const {
            gestorNome,
            gestorEmail,
            gestorSenha,
            idSetor: gestorSetor,
            idCargo: gestorCargo
        } = req.body;

        const gestorInfo = req.session.user;

        const gestorFoto = req.file ? req.file.filename : gestorInfo.foto;

        // Segunda etapa: atualizar o nome do gestor no banco de dados
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

        let erroRenomeacao = false;

        // Terceira etapa: renomear a pasta do gestor, se o nome foi alterado
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

        // Quarta etapa: mover a imagem do perfil do local temporário para o diretório definitivo do gestor
        const tempFilePath = `./public/uploads/temp/${gestorFoto}`;
        const destFilePath = `./public/uploads/${gestorNome}/${gestorFoto}`;

        try {
            if (fs.existsSync(tempFilePath)) {
                fs.renameSync(tempFilePath, destFilePath);
            }
        } catch (err) {
            console.error('Erro ao mover a imagem do perfil:', err);
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
});



module.exports = router;