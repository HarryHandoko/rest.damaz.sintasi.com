'use strict'
const Province = use('App/Models/Ref/Provinsi')
const City = use('App/Models/Ref/Kota')
const District = use('App/Models/Ref/Kelurahan')
const Village = use('App/Models/Ref/Desa')
const moment = require('moment')
const Database = use('Database'); // Adonis v4
const Env = use('Env') // for Adonis 4.x

class WilayahController {
  async getProvince ({request, response}){
    try {
      const dataProvince = await Province.query().fetch();
      return response.json({
        status_code: '200',
        status: 'success',
        data : dataProvince.toJSON()
      });
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Server error',
        error: error.message
      });
    }
  }

  async getCity ({request, response}){
    try {
      const dataCity = await City.query().where('province_code',request.input('province_id')).fetch();
      return response.json({
        status_code: '200',
        status: 'success',
        data : dataCity.toJSON()
      });
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Server error',
        error: error.message
      });
    }
  }

  async getDistrict ({request, response}){
    try {
      const dataDistrict = await District.query().where('city_code',request.input('city_id')).fetch();
      return response.json({
        status_code: '200',
        status: 'success',
        data : dataDistrict.toJSON()
      });
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Server error',
        error: error.message
      });
    }
  }


  async getVillage ({request, response}){
    try {
      const dataVillage = await Village.query().where('district_code',request.input('district_id')).fetch();
      return response.json({
        status_code: '200',
        status: 'success',
        data : dataVillage.toJSON()
      });
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Server error',
        error: error.message
      });
    }
  }
}

module.exports = WilayahController
