const express = require('express');
const router = express.Router();
const multer = require('multer');

/* Module import */
const Setor = require('../module/Setor');
const Cargo = require('../module/Cargo');
const Colaborador = require('../module/Colaborador');

/* Config */
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

/* Rotas */
router.get('/', async (req, res) => {
    const colabId = req.params.id;

    try {
        const listColabInfo = await Colaborador.findByPk(colabId);
        const listaSetores = await Setor.findAll();
        const listaCargos = await Cargo.findAll({ where: { nivel: 2 } });

        const gestorInfo = req.session.user;
        let imagePath = gestorInfo && gestorInfo.foto ? `/uploads/${gestorInfo.id}/${gestorInfo.foto}` : '';
        imagePath = imagePath || '/img/profile/default.jpg';

        /* res.render('editColab.ejs', {
            listColabInfo,
            listaSetores,
            listaCargos,
            imagePath,
            gestorInfo
        }); */

        res.redirect('/bolsonaro/editColab')
    } catch (error) {
        console.error('Erro:', error);
    }
});

router.post('/colabUpdate', uploadColabFoto.single('colabFoto'), async (req,res)=>{

    const gestorInfo = req.session.user;

    const listaSetores = await Setor.findAll();
    const listaCargos = await Cargo.findAll({
        where:{
            nivel: 2
        }
    });

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

    /*  // Verificar se todos os campos obrigatórios estão preenchidos
    if (!colabNome || !colabEmail || !colabSetor || !colabCargo) {
        return res.render('addColab.ejs', { error: 'Todos os campos são obrigatórios', listaSetores, listaCargos, imagePath, gestorInfo });
    } */

    try {
        await Colaborador.update({
        nome: colabNome,
        email: colabEmail,
        foto: colabFoto,
        idSetor: colabSetor,
        idCargo: colabCargo,
        idGestor: req.session.user.id
    }, {});

    res.redirect('/home/colaboradores')

    } catch (error) {
        console.error('Erro:', error);
        return res.render('addColab.ejs', { error: 'Erro ao cadastrar colaborador', listaSetores, listaCargos, imagePath, gestorInfo });
    }
});

module.exports = router;