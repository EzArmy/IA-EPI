const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

//Sequelize modules import
const Setor = require('../models/Setor');
const Cargo = require('../models/Cargo');
const Gestor = require('../models/Gestor');
const Colaborador = require('../models/Colaborador');

/////{ CONFIGURAÇÕES }///////////////////////////////////////////////////////////////////////////

//Multer config
const multer = require('multer');
const { error } = require('console');

const colabFotoStorage = multer.diskStorage({
    destination: (req, file, cb)=>{

        const gestorInfo = req.session.user;
        const pastaGestor = `./public/uploads/${gestorInfo.id}/`;
        const pastaColab = pastaGestor + 'Colaboradores/' + req.body.colabNome;

        if(!fs.existsSync(pastaColab)){
            fs.mkdirSync(pastaColab, {recursive: true});   
        }

        cb(null, pastaColab);
    },
    filename: (req, file, cb) => {
        const fileName = path.basename(file.originalname);
        cb(null, fileName)
    }
});

const uploadColabFoto = multer({storage: colabFotoStorage});

/////{ ROTAS }//////////////////////////////////////////////////////////////////////////////////

router.get('/', async (req,res)=>{
    const listaSetores = await Setor.findAll();
    const listaCargos = await Cargo.findAll({
        where:{
            nivel: 2
        }
    });

    const gestorInfo = req.session.user;

    let imagePath = gestorInfo && gestorInfo.foto ? `/uploads/${gestorInfo.id}/${gestorInfo.foto}` : '';
    
    // Se imagePath for null ou vazio, define a imagem padrão
    imagePath = imagePath || '/img/profile/default.jpg';
    
    res.render('addColab.ejs', {
        listaSetores:listaSetores,
        listaCargos: listaCargos,
        imagePath,
        gestorInfo,
        error:null
    });
});

router.post('/cadColab', uploadColabFoto.single('colabFoto'), async (req,res)=>{

    const listaSetores = await Setor.findAll();
    const listaCargos = await Cargo.findAll({
        where:{
            nivel: 2
        }
    });

    const gestorInfo = req.session.user;

    let imagePath = gestorInfo && gestorInfo.foto ? `/uploads/${gestorInfo.id}/${gestorInfo.foto}` : '';
    
    // Se imagePath for null ou vazio, define a imagem padrão
    imagePath = imagePath || '/img/profile/default.jpg';
    
    const { 
        colabNome, 
        colabEmail, 
        colabSetor, 
        colabCargo
    } = req.body;

    let colabFoto;

    if(req.file){
        colabFoto = req.file.filename;
    } else {
        colabFoto = null;
        const defaultImagePath = '/img/profile/default.jpg';

        if (fs.existsSync(defaultImagePath)) {
            colabFoto = defaultImagePath;
        } else {
            console.log('Imagem padrão não encontrada');
        }
    }

     // Verificar se todos os campos obrigatórios estão preenchidos
    if (!colabNome || !colabEmail || !colabSetor || !colabCargo) {
        return res.render('addColab.ejs', { error: 'Todos os campos são obrigatórios', listaSetores, listaCargos, imagePath, gestorInfo });
    }

    // Validar o formato do e-mail
   /*  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(colabEmail)) {
        return res.render('addColab.ejs', { error: 'E-mail inválido', listaSetores, listaCargos, imagePath, gestorInfo });
    } */

    try {
    const cadColaborador = await Colaborador.create({
        nome: colabNome,
        email: colabEmail,
        foto: colabFoto,
        idSetor: colabSetor,
        idCargo: colabCargo,
        idGestor: req.session.user.id
    });

    res.redirect('/home/colaboradores')

    } catch (error) {
        console.error('Erro:', error);
        return res.render('addColab.ejs', { error: 'Erro ao cadastrar colaborador', listaSetores, listaCargos, imagePath, gestorInfo });
    }

});

module.exports = router