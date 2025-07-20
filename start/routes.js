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

  // Master Konten Artikel
  Route.get('/master-content/artikel/get', 'MasterContent/ArtikelController.index')
  Route.get('/master-content/artikel/get-tag', 'MasterContent/ArtikelController.indexTag')
  Route.post('/master-content/artikel/post', 'MasterContent/ArtikelController.store')
  Route.post('/master-content/artikel/adding-tag', 'MasterContent/ArtikelController.AddingTag')
  Route.post('/master-content/artikel/delete', 'MasterContent/ArtikelController.delete')
  Route.post('/master-content/artikel/update', 'MasterContent/ArtikelController.update')

}).prefix('api').middleware(['auth:jwt','apikey'])
