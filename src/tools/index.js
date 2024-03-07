export function  isContainsMenu(name,menu_list) {
    return menu_list.some(item => item.path === name)
}