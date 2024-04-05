const express = require('express');
const router = express.Router();
const fs = require('fs');

//module import
const Colaborador = require('../module/Colaborador');
const Cargo = require('../module/Cargo');
const Setor = require('../module/Setor');

router.get('/', (req, res) => {

    const gestorInfo = req.session.user;

    let imagePath = gestorInfo && gestorInfo.foto ? `/uploads/${gestorInfo.id}/${gestorInfo.foto}` : '';

    // Se imagePath for null ou vazio, define a imagem padrão
    imagePath = imagePath || '/images/profile/default.jpg';

    res.render('home.ejs', { gestorInfo, imagePath });
});

// Middleware para renomear as pastas dos colaboradores
router.use('/colaboradores', async (req, res, next) => {
    const gestorInfo = req.session.user;

    // Listando colaboradores vinculados ao gestor
    const listColaborador = await Colaborador.findAll({
        where: { idGestor: [gestorInfo.id] }
    });

    // Renomear as pastas dos colaboradores
    listColaborador.forEach(colaborador => {
        const colabOldFolder = `./public/uploads/${gestorInfo.id}/Colaboradores/${colaborador.nome}`;
        const colabNewFolder = `./public/uploads/${gestorInfo.id}/Colaboradores/${colaborador.id}`;

        if (fs.existsSync(colabOldFolder)) {
            fs.renameSync(colabOldFolder, colabNewFolder);
        }
    });

    // Passa para a próxima função de middleware ou rota
    next();
});

// Rota para a página de Colaboradores
router.get('/colaboradores', async (req, res) => {

    const gestorInfo = req.session.user;

    // Listando colaboradores vinculados ao gestor
    const listColaborador = await Colaborador.findAll({
        where: { idGestor: [gestorInfo.id] }
    });

    let imagePath = gestorInfo && gestorInfo.foto ? `/uploads/${gestorInfo.id}/${gestorInfo.foto}` : '';

    // Se imagePath for null ou vazio, define a imagem padrão
    imagePath = imagePath || '/images/profile/default.jpg';

    res.render('colaboradores.ejs', {
        imagePath,
        listColaborador,
        gestorInfo
    });
});

//Rota para a página de detalhes de um colaborador
router.get(`/colaboradores/:id/:nome`, async (req, res) => {

    const colabId = req.params.id;

    //Listando colaboradores vinculados ao gestor
    const listColabInfo = await Colaborador.findAll({
        where: { id: [colabId] }
    });

    //Listando cargo dos colaboradores
    const listColabCargo = await Cargo.findAll({
        where: { id: [listColabInfo.idCargo] }
    });

    //Colentando dados do gestor logado
    const gestorInfo = req.session.user;

    let imagePath = gestorInfo && gestorInfo.foto ? `/uploads/${gestorInfo.id}/${gestorInfo.foto}` : '';

    // Se imagePath for null ou vazio, define a imagem padrão
    imagePath = imagePath || '/images/profile/default.jpg';

    res.render('pageColab.ejs', {
        colabId,
        listColabInfo,
        gestorInfo,
        listColabCargo,
        imagePath
    });
});

//Rota para a página de perfil do gestor
router.get('/perfilGestor', async (req, res) => {

    const gestorInfo = req.session.user;

    let imagePath = gestorInfo && gestorInfo.foto ? `/uploads/${gestorInfo.id}/${gestorInfo.foto}` : '';

    // Se imagePath for null ou vazio, define a imagem padrão
    imagePath = imagePath || '/images/profile/default.jpg';

    //Trazendo cargo do gestor
    const gestorCargo = await Cargo.findOne({
        where: { id: [gestorInfo.idCargo] }
    });

    //Trazendo setor do gestor
    const gestorSetor = await Setor.findOne({
        where: { id: [gestorInfo.idSetor] }
    });

    res.render('pageGestor.ejs', {
        gestorInfo,
        imagePath,
        gestorCargo,
        gestorSetor
    });
});

module.exports = router;