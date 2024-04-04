const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

//Sequelize modules import
const Setor = require('../module/Setor');
const Cargo = require('../module/Cargo');
const Gestor = require('../module/Gestor');
const Colaborador = require('../module/Colaborador');

/////{ CONFIGURAÇÕES }///////////////////////////////////////////////////////////////////////////

//Multer config
const multer = require('multer');

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

    //caminho para as imagens apresentadas no menu
    const imagePath = gestorInfo ? `/uploads/${gestorInfo.id}/${gestorInfo.foto}`:`/uploads/${gestorInfo.id}/${gestorInfo.foto}`;

    res.render('addColab.ejs', {
        listaSetores:listaSetores,
        listaCargos: listaCargos,
        imagePath,
        gestorInfo
    });
});

router.post('/cadColab', uploadColabFoto.single('colabFoto'), async (req,res)=>{
    const { 
        colabNome, 
        colabEmail, 
        colabSetor, 
        colabCargo
    } = req.body;

    const colabFoto = req.file.filename;

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
    }

});

module.exports = router