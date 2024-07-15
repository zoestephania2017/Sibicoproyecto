<?php

return [
    [
        "codigo_acceso" => "0",
        "label" => "Dashboard",
        "icon" => "fas fa-home",
        "url" => url('dashboard/'),
        "active" => isRoute('dashboard/')
    ],
    [
        "codigo_acceso" => "4",
      //  "label" => "Mantenimientos",
        "label" => "Administracion",
        "icon" => "fas fa-tools",
        "url" => url('dashboard/maintenance/'),
        "dropdown" => [
           /* [
                "codigo_acceso" => "1",
                "label" => "Marca",
                "url" => url('dashboard/maintenance/brand.php'),
                "active" => isRoute('dashboard/maintenance/brand.php')
            ],*/
           /* [
                "codigo_acceso" => "2",
                "label" => "Modelo",
                "url" => url('dashboard/maintenance/model.php'),
                "active" => isRoute('dashboard/maintenance/model.php')
            ],*/
            /*[
                "codigo_acceso" => "3",
                "label" => "Año",
                "url" => url('dashboard/maintenance/year.php'),
                "active" => isRoute('dashboard/maintenance/year.php')
            ],*/
            [
                "codigo_acceso" => "4",
                "label" => "Cliente",
                "url" => url('dashboard/maintenance/client.php'),
                "active" => isRoute('dashboard/maintenance/client.php')
            ],
            [
                "codigo_acceso" => "5",
                "label" => "Usuario",
                "url" => url('dashboard/maintenance/user.php'),
                "active" => isRoute('dashboard/maintenance/user.php')
            ],
          /*  [
                "codigo_acceso" => "6",
                "label" => "Suministros",
                "url" => url('dashboard/maintenance/store.php'),
                "active" => isRoute('dashboard/maintenance/store.php')
            ],*/
            [
                "codigo_acceso" => "7",
                "label" => "Perfil",
                "url" => url('dashboard/maintenance/profile.php'),
                "active" => isRoute('dashboard/maintenance/profile.php')
            ],
            [
                "codigo_acceso" => "8",
                "label" => "Acceso",
                "url" => url('dashboard/maintenance/access.php'),
                "active" => isRoute('dashboard/maintenance/access.php')
            ],
           /* [
                "codigo_acceso" => "16",
                "label" => "Acta",
                "url" => url('dashboard/maintenance/proceeding.php'),
                "active" => isRoute('dashboard/maintenance/proceeding.php')
            ],*/
        ]
    ],
    [
        "codigo_acceso" => "9",
        //"label" => "Transacciones",
        "label" => "Cargo y Descargo",
        "icon" => "fas fa-exchange-alt",
        "url" => url('dashboard/transactions/'),
        "dropdown" => [
            [
                "codigo_acceso" => "9",
                //"label" => "Consignación",
                "label" => "Cargo de bienes",
                //"url" => url('dashboard/transactions/consignment.php'),
                //"active" => isRoute('dashboard/transactions/consignment.php')
                "url" => url('dashboard/transactions/cargo_view.php'),
                "active" => isRoute('dashboard/transactions/cargo_view.php')
            ],
            [
                "codigo_acceso" => "10",
                //"label" => "Entradas",
                "label" => "Descargo de bienes",
                //"url" => url('dashboard/transactions/entry.php'),
                //"active" => isRoute('dashboard/transactions/entry.php')
                "url" => url('dashboard/transactions/descargo_view.php'),
                "active" => isRoute('dashboard/transactions/descargo_view.php')
            ],
            [
                "codigo_acceso" => "11",
                //"label" => "Actas de entrega",
                "label" => "Custodia de bienes",
                //"url" => url('dashboard/transactions/sale.php'),
                //"active" => isRoute('dashboard/transactions/sale.php')
                "url" => url('dashboard/transactions/custodia_view.php'),
                "active" => isRoute('dashboard/transactions/custodia__view.php')
            ],
           /* [
                "codigo_acceso" => "12",
                "label" => "Devolución",
                "url" => url('dashboard/transactions/repayment.php'),
                "active" => isRoute('dashboard/transactions/repayment.php')
            ]*/
        ]
    ],
    [
        "codigo_acceso" => "14",
        "label" => "Inventario",
        "icon" => "fas fa-boxes",
        "url" => url('dashboard/inventory/'),
        "dropdown" => [
            [
                "codigo_acceso" => "13",
               // "label" => "Inventario inicial",
                "label" => "Nuevo Mobiliario",
                //"url" => url('dashboard/inventory/initial.php'),
               // "active" => isRoute('dashboard/inventory/initial.php')
                "url" => url('dashboard/inventory/nuevo_mobiliario.php'),
                "active" => isRoute('dashboard/inventory/nuevo_mobiliario.php')
            ],
            [
                "codigo_acceso" => "14",
                "label" => "Existencias",
               //"url" => url('dashboard/inventory/stocks.php'),
                //"active" => isRoute('dashboard/inventory/stocks.php')
                "url" => url('dashboard/inventory/tabla_mobiliario.php'),
                "active" => isRoute('dashboard/inventory/tabla_mobiliario.php')
            ]
        ]
    ],
    [
        "codigo_acceso" => "15",
        //"label" => "Reportes",
        "label" => "Actas",
        "icon" => "fas fa-archive",
        "url" => url('dashboard/reports/'),
        "dropdown" => [
            [
                "codigo_acceso" => "15",
                //"label" => "Reportes generales",
                "label" => "Asignacion",
                //"url" => url('dashboard/reports/reports_general.php'),
                //"active" => isRoute('dashboard/reports/reports_general.php')
                "url" => url('dashboard/reports/asignacion_view.php'),
                "active" => isRoute('dashboard/reports/asignacion_view.php')
            ],
            [
                "codigo_acceso" => "15",
                //"label" => "Reportes ventas",
                "label" => "Custodia",
                //"url" => url('dashboard/reports/reports_sales.php'),
                //"active" => isRoute('dashboard/reports/reports_sales.php')
                "url" => url('dashboard/reports/custodia_view.php'),
                "active" => isRoute('dashboard/reports/custodia_view.php')
            ],
            [
                "codigo_acceso" => "15",
                //"label" => "Reportes por responsable de entrega",
                "label" => "Descargo",
                //"url" => url('dashboard/reports/reports_responsible.php'),
                //"active" => isRoute('dashboard/reports/reports_responsible.php')
                "url" => url('dashboard/reports/descargo_view.php'),
                "active" => isRoute('dashboard/reports/descargo_view.php')
            ],
            [
                "codigo_acceso" => "15",
               // "label" => "Reportes de cortes diarios",
               "label" => "Pase de Salidas",
              // "url" => url('dashboard/reports/reports_cuts.php'),
              //  "active" => isRoute('dashboard/reports/reports_cuts.php')
                "url" => url('dashboard/reports/pase_salida_view.php'),
                "active" => isRoute('dashboard/reports/pase_salida_view.php')
            ],
        ]
    ],
    [
        "codigo_acceso" => "17",
        "label" => "Bitácora",
        "icon" => "fas fa-history",
        "url" => url('dashboard/logbook/'),
        "active" => isRoute('dashboard/logbook/')
    ],
    [
        "codigo_acceso" => "0",
        "label" => "Cuenta",
        "icon" => "fas fa-user",
        "url" => url('dashboard/account/account.php'),
        "active" => isRoute('dashboard/account/account.php')
    ],
    [
        "codigo_acceso" => "0",
        "label" => "Salir",
        "icon" => "fas fa-sign-out-alt",
        "url" => url('app/controllers/LogoutController.php'),
        "active" => isRoute('app/controllers/LogoutController.php')
    ]
];
