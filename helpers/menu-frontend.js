const getMenuFrontEnd = (role = 'USER_ROLE') => {





    if (role === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: 'usuarios' })
    }


}

module.exports = {
    getMenuFrontEnd
}