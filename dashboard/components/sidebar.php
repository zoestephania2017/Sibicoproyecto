<?php
$menuItems = include __DIR__ . "/options.php";
$menuItems = $menuItems ?? [];

$access = [];
$accesses = [];

if ($session->has('access')) {
    $accessData = $session->get('access');
    $accesses = $accessData;
    $access = array_column($accessData, 'codigo_acceso');
}

$specialItems = ['Dashboard', 'Cuenta', 'Salir'];
$filteredMenuItems = [];

foreach ($specialItems as $specialItem) {
    $filteredItem = findMenuItemByLabel($menuItems, $specialItem);
    if ($filteredItem) {
        $filteredMenuItems[] = $filteredItem;
    }
}

foreach ($menuItems as $item) {
    if (!in_array($item['label'], $specialItems)) {
        if (isset($item['dropdown'])) {
            $filteredDropdown = array_filter($item['dropdown'], function ($subItem) use ($access) {
                return in_array($subItem['codigo_acceso'], $access);
            });

            if (count($filteredDropdown) > 0) {
                $item['dropdown'] = $filteredDropdown;
                $filteredMenuItems[] = $item;
            }
        } else {
            if (in_array($item['codigo_acceso'], $access)) {
                $filteredMenuItems[] = $item;
            }
        }
    }
}

$cuentaItem = findMenuItemByLabel($filteredMenuItems, 'Cuenta');
$salirItem = findMenuItemByLabel($filteredMenuItems, 'Salir');

if ($cuentaItem) {
    $filteredMenuItems = removeMenuItemByLabel($filteredMenuItems, 'Cuenta');
    $filteredMenuItems[] = $cuentaItem;
}

if ($salirItem) {
    $filteredMenuItems = removeMenuItemByLabel($filteredMenuItems, 'Salir');
    $filteredMenuItems[] = $salirItem;
}

$menuItems = $filteredMenuItems;

foreach ($menuItems as $item) {
    if (isset($item['dropdown'])) {
        $isDropdownActive = false;

        foreach ($item['dropdown'] as $subItem) {
            if ($subItem['active']) {
                $isDropdownActive = true;
                break;
            }
        }
?>

        <li>
            <button type="button" class="flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-gray-200 hover:text-gray-900" aria-controls="dropdown-<?php echo strtolower(str_replace(' ', '-', $item['label'])); ?>" data-collapse-toggle="dropdown-<?php echo strtolower(str_replace(' ', '-', $item['label'])); ?>" <?php echo $isDropdownActive ? 'aria-expanded="true"' : 'aria-expanded="false"'; ?>>
                <i class="<?php echo $item['icon']; ?> fa-lg text-black"></i>
                <span class="flex-1 ml-3 text-left whitespace-nowrap text-black" sidebar-toggle-item><?php echo $item['label']; ?></span>
                <i class="fas fa-chevron-down fa-md text-black"></i>
            </button>
            <ul id="dropdown-<?php echo strtolower(str_replace(' ', '-', $item['label'])); ?>" class="<?php echo $isDropdownActive ? 'block' : 'hidden'; ?> py-2 space-y-2">
                <?php foreach ($item['dropdown'] as $subItem) : ?>
                    <li>
                        <a href="<?php echo $subItem['url']; ?>" class="flex items-center w-full p-2 transition duration-75 rounded-lg pl-11 <?php echo $subItem['active'] ? 'bg-gray-200 text-gray-900 font-bold' : 'text-black'; ?> group hover:bg-gray-200 hover:text-gray-900">
                            <?php echo $subItem['label']; ?>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </li>
    <?php } else { ?>
        <li>
            <a href="<?php echo $item['url']; ?>" class="flex items-center p-2 rounded-lg <?= $item['active'] ? 'bg-gray-200 text-black font-bold' : 'text-black' ?> hover:bg-gray-200 hover:text-gray-900">
                <i class="<?php echo $item['icon']; ?> fa-lg"></i>
                <span class="ml-3"><?php echo $item['label']; ?></span>
            </a>
        </li>
<?php }
}

function findMenuItemByLabel($menuItems, $label)
{
    foreach ($menuItems as $item) {
        if ($item['label'] === $label) {
            return $item;
        }
    }
    return null;
}

function removeMenuItemByLabel($menuItems, $label)
{
    return array_values(array_filter($menuItems, function ($item) use ($label) {
        return $item['label'] !== $label;
    }));
}
?>
