const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SurveyValues = Schema({
    survey: { type: Schema.Types.ObjectId, ref: 'Survey' },
    value: { type: Number, required: true }
});

module.exports = mongoose.model('SurveyValues', SurveyValues)