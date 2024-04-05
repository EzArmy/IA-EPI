const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

//Sequelize modules import
const Setor = require('../module/Setor');
const Cargo = require('../module/Cargo');
const Gestor = require('../module/Gestor');

/////{ CONFIGURAÇÕES }///////////////////////////////////////////////////////////////////////////

//Multer config
const multer = require('multer');

const gestorFotoStorage = multer.diskStorage({
    destination: (req, file, cb) => {

        const pastaGestor = './public/uploads/' + req.body.gestorNome;
        if (!fs.existsSync(pastaGestor)) {
            fs.mkdirSync(pastaGestor, { recursive: true });
        }
        cb(null, pastaGestor);
    },
    filename: (req, file, cb) => {
        const fileName = path.basename(file.originalname);
        cb(null, fileName);
    }
});

const uploadGestorFotoStorage = multer({ storage: gestorFotoStorage });

/////{ ROTAS }//////////////////////////////////////////////////////////////////////////////////

router.get('/', async (req, res) => {

    const listaSetores = await Setor.findAll();
    const listaCargos = await Cargo.findAll({
        where: {
            nivel: 1
        }
    });

    res.render('signUp.ejs', {
        listaSetores: listaSetores,
        listaCargos: listaCargos,
        error: null
    });

});

router.post('/cadGestor', uploadGestorFotoStorage.single('gestorFoto'), async (req, res) => {

    const listaSetores = await Setor.findAll();
    const listaCargos = await Cargo.findAll({
        where: {
            nivel: 1
        }
    });

    const {
        gestorNome,
        gestorEmail,
        gestorSenha,
        gestorSetor,
        gestorCargo
    } = req.body;

    let gestorFoto;

    // Verifica se a foto do gestor foi enviada
    if (req.file) {
        gestorFoto = req.file.filename;
    } else {
        // Se não houver foto, define como null e define uma imagem padrão
        gestorFoto = null;
        // Caminho da imagem padrão
        const defaultImagePath = 'default.jpg';
        // Verifica se o arquivo de imagem padrão existe
        if (fs.existsSync(defaultImagePath)) {
            // Usa a imagem padrão
            gestorFoto = defaultImagePath;
        } else {
            console.log('Imagem padrão não encontrada');
            // Se não encontrar a imagem padrão, você pode lidar com isso de acordo com o seu caso
            // Por exemplo, pode enviar uma mensagem de erro ou redirecionar para uma página de erro
        }
    }

    /* Verificando existência do email */
    const existingGestor = await Gestor.findOne({ where: { email: req.body.gestorEmail } });

    // Expressão regular para validar a senha
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (existingGestor) {
        // Caso o email já exista
        res.render('signUp.ejs', {
            listaSetores: listaSetores,
            listaCargos: listaCargos,
            error: 'Email já cadastrado'
        });
    } else if (!senhaRegex.test(gestorSenha)) {
        // Caso a senha não corresponda aos critérios
        res.render('signUp.ejs', {
            listaSetores: listaSetores,
            listaCargos: listaCargos,
            error: 'É preciso que a senha tenha no mínimo 8 caracteres, uma letra maiúscula e uma letra minúscula'
        });
    } else {
        const cadGestor = await Gestor.create({
            nome: gestorNome,
            email: gestorEmail,
            senha: gestorSenha,
            foto: gestorFoto,
            idSetor: gestorSetor,
            idCargo: gestorCargo
        });

        res.redirect('/');
    }

});


module.exports = router;