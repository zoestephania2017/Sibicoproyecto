<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="styles.css"> <!-- Asegúrate de que el archivo CSS esté en la misma carpeta o ajusta la ruta -->
</head>
<body>
    <div class="sidebar">
        <button onclick="showView('cargo')">Cargo de Bienes</button>
        <button onclick="showView('custodia')">Custodia de Bienes</button>
        <button onclick="showView('descargo')">Descargo de Bienes</button>
    </div>

    <div class="content">
        <div id="cargo" class="view-container">
            <?php include 'cargo_view.php'; ?>
        </div>
        <div id="custodia" class="view-container">
            <?php include 'custodia_view.php'; ?>
        </div>
        <div id="descargo" class="view-container">
            <?php include 'descargo_view.php'; ?>
        </div>
    </div>

    <script>
        function showView(viewId) {
            // Ocultar todas las vistas
            document.querySelectorAll('.view-container').forEach(container => {
                container.classList.remove('active');
            });

            // Mostrar la vista seleccionada
            document.getElementById(viewId).classList.add('active');
        }

        // Mostrar la primera vista por defecto
        showView('cargo');
    </script>
</body>
</html>
