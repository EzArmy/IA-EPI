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
    destination: (req, file, cb)=>{

        const pastaGestor = './public/uploads/' + req.body.gestorNome;
        if(!fs.existsSync(pastaGestor)){
            fs.mkdirSync(pastaGestor, {recursive: true});
        }
        cb(null, pastaGestor);
       
    },
    filename: (req, file, cb)=>{
        const fileName = path.basename(file.originalname);
        cb(null, fileName);
    }
});

const uploadGestorFotoStorage = multer({storage: gestorFotoStorage});

/////{ ROTAS }//////////////////////////////////////////////////////////////////////////////////

router.get('/', async (req, res) => {

    const listaSetores = await Setor.findAll();
    const listaCargos = await Cargo.findAll({
        where: {
            id: [1, 2]
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
            id: [1, 2]
        }
    });

    const {
        gestorNome,
        gestorEmail,
        gestorSenha,
        gestorSetor,
        gestorCargo
    } = req.body;

    const gestorFoto = req.file.filename;

    /* Verificando existência do email */
    const existingGestor = await Gestor.findOne({ where: { email: req.body.gestorEmail } });

    if (existingGestor) {
        // Se o email já estiver cadastrado, retorne um erro
        res.render('signUp.ejs', {
            listaSetores: listaSetores,
            listaCargos: listaCargos,
            error:'Email já cadastrado'
        });
    }

    /* Verificando senha */
    // Expressão regular para validar a senha
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    // Verifique se a senha atende aos critérios
    if (!senhaRegex.test(gestorSenha)) {
        res.render('signUp.ejs', {
            listaSetores: listaSetores,
            listaCargos: listaCargos,
            error: 'É preciso que a senha tenha no mínimo 8 caracteres, uma letra maiúscula e uma letra minúscula'});
    }

    const cadGestor = await Gestor.create({
        nome: gestorNome,
        email: gestorEmail,
        senha: gestorSenha,
        foto: gestorFoto,
        idSetor: gestorSetor,
        idCargo: gestorCargo
    });

    res.redirect('/');
});

module.exports = router;