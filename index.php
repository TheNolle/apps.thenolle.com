<!DOCTYPE html>
<html lang="en">

<head>
    <title>Nolly's Apps</title>
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta property="og:site_name" content="Nolly's Apps" />
    <meta property="og:title" content="Nolly's Apps" />
    <meta property="og:description" content="A collection of apps, widgets and games made by Nolly" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://apps.thenolle.com" />
    <meta property="og:image" content="https://apps.thenolle.com/assets/img/favicon.ico" />
    <meta property="og:image:secure_url" content="https://apps.thenolle.com/assets/img/favicon.ico" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:alt" content="Nolly's Apps" />

    <style>
        * {
            margin: 0;
            padding: 0;
            border: none;
            outline: none;
            box-sizing: border-box;
            font-family: 'Roboto', sans-serif;
        }

        html,
        body {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            padding: 1rem 0.25rem;
            color: #fff;
            background-color: #101113;
        }

        div.content {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            align-items: start;
            justify-content: start;
            row-gap: 0.5rem;
        }

        a {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            text-align: center;
            row-gap: 0.125rem;
            text-decoration: none;
            color: #fff;
        }

        a:hover,
        a:focus {
            color: #E5204C;
        }

        img {
            width: 100px;
            height: 100px;
            object-fit: cover;
        }

        a:hover img,
        a:focus img {
            box-shadow: 0 0 0 2px #E5204C;
        }

        h2 {
            font-size: 1rem;
            font-weight: 400;
        }
    </style>
</head>

<body>
    <div class="content">
        <?php
        $dir = new DirectoryIterator(__DIR__);
        foreach ($dir as $fileinfo) {
            if ($fileinfo->isDir() && !$fileinfo->isDot()) {
        ?>
                <a href='/<?php echo $fileinfo->getFilename() ?>'>
                    <img src='<?php echo $fileinfo->getFilename() ?>/favicon.ico' alt='<?php echo $fileinfo->getFilename() ?>'>
                    <h2><?php echo $fileinfo->getFilename() ?></h2>
                </a>
        <?php
            }
        }
        ?>
    </div>
</body>

</html>