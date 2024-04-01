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
        const infoGestor = req.session.user;
        const pastaGestor = `./public/uploads/${infoGestor.nome}/`;
        const pastaColab = pastaGestor + 'Colaboradores/' + req.body.colabNome;

        if(!fs.existsSync(pastaColab)){
            fs.mkdirSync(pastaColab, {recursive: true});   
        }

        cb(null, pastaColab);

        console.log(infoGestor);
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

    //caminho para as imagens apresentadas no menu
    const imagePath = req.session.user ? `/uploads/${req.session.user.nome}/${req.session.user.foto}`:`/uploads/${req.session.user.nome}/${req.session.user.foto}`;

    res.render('addColab.ejs', {
        listaSetores:listaSetores,
        listaCargos: listaCargos,
        imagePath
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