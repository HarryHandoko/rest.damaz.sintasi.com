'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')
Route.group(() => {
    Route.post('/login', 'AuthController.login')
    Route.post('/daftar', 'AuthController.daftar')
    Route.get('/captcha', 'AuthController.getChaptca')
}).prefix('api').middleware(['apikey'])

Route.group(() => {
  Route.get('/users', 'AuthController.index')

  // roles
  Route.get('/roles/get', 'RoleController.index')
  Route.get('/roles/get-select', 'RoleController.getSelect')
  Route.post('/roles/post', 'RoleController.store')
  Route.post('/roles/delete', 'RoleController.delete')
  Route.post('/roles/update', 'RoleController.update')
  Route.post('/roles/get-menu', 'RoleController.getRolePermission')
  Route.post('/roles/set-permission', 'RoleController.setPermission')


  // Menu
  Route.get('/menu/get', 'MenuController.index')
  Route.post('/menu/post', 'MenuController.store')
  Route.post('/menu/delete', 'MenuController.delete')
  Route.post('/menu/update', 'MenuController.update')
  Route.post('/menu/update-sort', 'MenuController.updateSort')

  // Master Karyawan
  Route.get('/master/karyawan/get', 'Master/KaryawanController.index')
  Route.post('/master/karyawan/post', 'Master/KaryawanController.store')
  Route.post('/master/karyawan/delete', 'Master/KaryawanController.delete')
  Route.post('/master/karyawan/update', 'Master/KaryawanController.update')
  Route.post('/master/karyawan/update-data', 'Master/KaryawanController.updateData')



  // Master Konten Galeri
  Route.get('/master-content/galeri/get', 'MasterContent/GaleriController.index')
  Route.post('/master-content/galeri/post', 'MasterContent/GaleriController.store')
  Route.post('/master-content/galeri/delete', 'MasterContent/GaleriController.delete')
  Route.post('/master-content/galeri/update', 'MasterContent/GaleriController.update')


  // Master Bank Account
  Route.get('/master-data/bank-account/get', 'Master/BankAccountController.index')
  Route.get('/master-data/bank-account/get-payment', 'Master/BankAccountController.indexPayment')
  Route.post('/master-data/bank-account/post', 'Master/BankAccountController.store')
  Route.post('/master-data/bank-account/delete', 'Master/BankAccountController.delete')
  Route.post('/master-data/bank-account/update', 'Master/BankAccountController.update')

  // Master Konten Artikel
  Route.get('/master-content/artikel/get', 'MasterContent/ArtikelController.index')
  Route.get('/master-content/artikel/get-tag', 'MasterContent/ArtikelController.indexTag')
  Route.post('/master-content/artikel/post', 'MasterContent/ArtikelController.store')
  Route.post('/master-content/artikel/adding-tag', 'MasterContent/ArtikelController.AddingTag')
  Route.post('/master-content/artikel/delete', 'MasterContent/ArtikelController.delete')
  Route.post('/master-content/artikel/update', 'MasterContent/ArtikelController.update')

  // WebProfile
  Route.post('/master-content/web-profile', 'MasterContent/WebProfileController.show')
  Route.post('/master-content/web-profile-update', 'MasterContent/WebProfileController.update')


  // Sekolah
  Route.get('/master-data/sekolah/get', 'MasterData/SekolahController.index')
  Route.get('/master-data/sekolah/get-select', 'MasterData/SekolahController.indexSelect')
  Route.post('/master-data/sekolah/get-select-grade', 'MasterData/SekolahController.indexSelectGrade')
  Route.post('/master-data/sekolah/post', 'MasterData/SekolahController.store')
  Route.post('/master-data/sekolah/adding-grade', 'MasterData/SekolahController.storeGrade')
  Route.post('/master-data/sekolah/delete', 'MasterData/SekolahController.delete')
  Route.post('/master-data/sekolah/update', 'MasterData/SekolahController.update')
  Route.post('/master-data/sekolah/update-grade', 'MasterData/SekolahController.updateGrade')

  //Register PPDB
  Route.post('/register-ppdb/get-data', 'PPDB/RegisterController.getData')
  Route.post('/register-ppdb/create', 'PPDB/RegisterController.create')
  Route.post('/register-ppdb/update-form', 'PPDB/RegisterController.updateForm')
  Route.post('/register-ppdb/delete', 'PPDB/RegisterController.delete')
  Route.post('/register-ppdb/get-detail', 'PPDB/RegisterController.getData')
  Route.post('/register-ppdb/get-regist', 'PPDB/RegisterController.getRegist')
  Route.post('/register-ppdb/generate-pdf', 'PPDB/RegisterController.generatePDF')
  Route.post('/register-ppdb/generate-kts-pdf', 'PPDB/RegisterController.generateKTSPDF')
  Route.post('/register-ppdb/approval', 'PPDB/RegisterController.Approval')
  Route.post('/register-ppdb/daftar-ulang', 'PPDB/RegisterController.daftarUlang')
  Route.post('/register-ppdb/get-daftar-ulang', 'PPDB/RegisterController.getDaftarUlang')
  Route.post('/register-ppdb/pay-reg-ulang', 'PPDB/RegisterController.payRegUlang')
  Route.post('/register-ppdb/get-pendaftaran-ulang', 'PPDB/RegisterController.getPendfataranUlangList')
  Route.post('/register-ppdb/pendaftaran-ulang-approval', 'PPDB/RegisterController.ApprovalRegisUlang')


  Route.get('/register-ppdb/statistik-pendaftar', 'PPDB/RegisterController.statistikPendaftar')
  Route.get('/register-ppdb/statistik-pendaftar-ulang', 'PPDB/RegisterController.statistikPendaftarUlang')


  //Register PPDB
  Route.get('/province/get-data', 'Ref/WilayahController.getProvince')
  Route.post('/city/get-data', 'Ref/WilayahController.getCity')
  Route.post('/district/get-data', 'Ref/WilayahController.getDistrict')
  Route.post('/village/get-data', 'Ref/WilayahController.getVillage')

  //Verifikasi Email
  Route.post('/verifikasi/resend-otp', 'VerifikasiEmailController.sendEmail')
  Route.post('/verifikasi/verify-email', 'VerifikasiEmailController.verifikasiEmail')

}).prefix('api').middleware(['auth:jwt','apikey'])
