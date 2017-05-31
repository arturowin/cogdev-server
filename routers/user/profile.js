const express = require('express');
const profile = express.Router();
const GoogleService = require('../../services/google.service');
profile.get('/all', (req, res) => {
    let googleService = new GoogleService('ya29.GlxZBHs9ZhfcckG71UoOYMF4Ez371UbvpEq522c8DmEx0ugXj_liG5-52cE4nphoPVDXXo947W3PnVi-3-SzsEeoskTezV_3ctWBRQ3EAb6QAhC6rrHywflFXA4GSg','ACXxpGEGt2A2w2w7JN38IlOFac0P0EiwAA8DZqL1kE2yOB-LA9wqbJYyjzxADpnIqqvFmdIGVAkuC5rk46UWzJndchWhYndSbPh7oS1gkvZxV_ytSsg9qe2-9QiV7LNuNU_9bS31bv3Ztfsw6GUV5xuU8lRpRwiMp-eWOT18vTkDnimfmOJtNUVwbGxTIf2H5tQdbD1YsmFLVtMdcXDFNuPWXaPcV4HZDitSm8WONxPfg_fMntQ6bu_mTj-nq3oGEzG0FaEMfYwn8q5v_v12LQwnZNRjzFRbcNR-2gOQJ8VSRezkrMWnJtlm7vj04DoYnRMXIaCU0s3sYARNk7YCtdkp68A7kznR4udexV-jFJmbZLKCTy8Wuwo').gDrive();
    res.json({
        name : 'lorem',
        age: 25
    });
});

module.exports = profile;
