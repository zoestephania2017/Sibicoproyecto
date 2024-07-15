export function alert(title = '', message = '', icon = 'success', button = 'OK', dangerMode = false) {
    swal({
        title: title,
        text: message,
        icon: icon,
        button: button,
        dangerMode: dangerMode
    });
}