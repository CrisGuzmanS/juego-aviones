/*=====
  JUEGO
  =====*/

(function() { // FUNCION ANONIMA
    $(document).ready(function() { // SE EJECUTA CUANDO EL DOCUMENTO (HTML) ESTE LISTO

        /*======================
          VARIABLES OBJETO JUEGO
          ======================*/

        var game = {}; // VARIABLE OBJETO DEL JUEGO
        game.stars = []; // VARIABLE ARREGLO DE OBJETO ESTRELLAS
        game.keys = []; // VARIABLE ARREGLO DE OBJETO TECLA
        game.projectiles = []; // VARIABLE ARREGLO DE OBJETO PROYECTIL
        game.enemies = []; // ALMACENARA A CADA UNO DE LOS ENEMIGOS QUE HAY EN PANTALLA
        game.images = []; // CONTENDRÁ LAS IMAGENES DEL JUEGO

        /*========================
          VARIABLES GLOBALES JUEGO
          ========================*/

        game.width = 550; // ALMACENA EL ANCHO DEL JUEGO
        game.height = 600; // ALMACENA EL ALTO DEL JUEGO
        game.doneImages = 0; // ALMACENA LAS IMAGENES YA CARGADAS
        game.requiredImages = 0; // ALMACENA EL NUMERO DE IMAGENES QUE SE NECESITA
        game.gameOver = false; // ALMACENA SI EL JUGADOR PIERDE
        game.gameWon = false; // ALMACENA SI EL JUGADOR GANA
        game.count = 24; // ALMACENA EL DIVISOR DE UN TIMER
        game.division = 48; // ALMACENA EL DIVIDENDO DE UN TIMER
        game.left = false;
        game.enemieSpeed = 3; // ALMACENA LA VELOCIDAD CON LA QUE SE MUEVEN LOS ENEMIGOS
        game.moving = false;
        game.fullShootTimer = 10; // ALMACENA LOS FOTOGRAMAS NECESARIOS PARA DISPARAR LA SIGUIENTE BALA
        game.shootTimer = game.fullShootTimer; // ALMACENA EL FOTOGRAMA PARA LLEGAR A LOS FOTOGRAMAS NECESARIO

        game.player = { // ALMACENA EL OBJETO PLAYER Y SUS PROPIEDADES
            x: game.width / 2 - 50, // ALMACENA LA POSICION EN X DEL JUGADOR
            y: game.height - 130, // ALMACENA LA POSICION EN Y DEL JUGADOR
            width: 100, // ALMACENA EL ANCHO DEL JUGADOR
            height: 121.5, // ALMACENA EL ALTO DEL JUGADOR
            speed: 3, // ALMACENA LA VELOCIDAD DEL JUGADOR
            rendered: false
        };

        /*=======
          LIENZOS
          =======*/

        game.contextBackground = document.getElementById('backgroundCanvas').getContext('2d');
        game.contextPlayer = document.getElementById('playerCanvas').getContext('2d');
        game.contextEnemies = document.getElementById('enemiesCanvas').getContext('2d');

        /*=======
          EVENTOS
          =======*/

        $(document).keydown(function(e) {
            game.keys[e.keyCode ? e.keyCode : e.which] = true;
        });

        $(document).keyup(function(e) {
            delete game.keys[e.keyCode ? e.keyCode : e.which];
        });

        document.getElementById("backgroundCanvas").style.background = "#2c3e50";

        /*=========
          FUNCIONES
          =========*/

        function addBullet() {
            game.projectiles.push({
                x: game.player.x + game.player.width / 2 - 15,
                y: game.player.y,
                width: 20,
                height: 21.76
            });
        }

        function init() { // FUNCION QUE EJECUTA LAS CONDICIONES INICIALES DEL JUEGO
            for (i = 0; i < 600; i++) { // RECORRE DESDE LA PRIMERA ESTRELLA HASTA LA ULTIMA
                game.stars.push({ // SE EL AÑADE LAS PROPIEDADES RESPECTIVAS DE LAS ESTRELLAS
                    x: Math.floor(Math.random() * game.width), // SE POSICIOPNARA EN UN NUMERO ALEATORIO A LO LARGO DEL EJE X
                    y: Math.floor(Math.random() * game.height), // COMENZARA AFUERA DE LA PANTALLA
                    size: Math.random() * 5 // SU MEDADIDA
                });
            }

            for (y = 0; y < 5; y++) {
                for (x = 0; x < 5; x++) {
                    game.enemies.push({
                        x: 80 * (x + 1),
                        y: 80 * (y + 1 / 2),
                        width: 70,
                        height: 46.8,
                        imageX: 0,
                        imageY: 34,
                        imageWidth: 151,
                        imageHeight: 101,
                        dead: false,
                        deadTime: 20
                    });
                }
            }
            loop(); // EJECUTA EL BUCLE DE REDIBUJADO
            setTimeout(function() {
                game.moving = true;
            }, 5000);
        }

        function addStars(num) { // FUNCION QUE AÑADE ESTRELLAS DEPENDIENDO EL NUMERO MANDADO
            for (i = 0; i < num; i++) { // RECORRE DESDE LA PRIMERA ESTRELLA HASTA LA ULTIMA
                game.stars.push({ // SE EL AÑADE LAS PROPIEDADES RESPECTIVAS DE LAS ESTRELLAS
                    x: Math.floor(Math.random() * game.width), // SE POSICIOPNARA EN UN NUMERO ALEATORIO A LO LARGO DEL EJE X
                    y: game.height + 10, // COMENZARA AFUERA DE LA PANTALLA
                    size: Math.random() * 5 // SU MEDADIDA
                });
            }
        }

        function moverEstrellas() {
            for (i in game.stars) { // RECORRE TODAS LAS ESTRELLAS PARA ELIMINARLA O PARA QUE SUBA
                if (game.stars[i].y <= -5) { // SE EJECUTA SI LA ESTRELLA ESTA YA 5 PIXELES FUERA DEL LIENZO
                    game.stars.splice(i, 1); // REMUEVE LA ESTRELLA QUE YA SALIÓ DEL LIENZO
                }
                game.stars[i].y--; // BAJA UN PIXEL LA ESTRELLA
            }
        }

        function moverJugador() {
            if (game.keys[37] || game.keys[65]) {
                if (!game.gameOver && !game.gameWon) {
                    if (game.player.x >= 0) {
                        game.player.x -= game.player.speed;
                        game.player.rendered = false;
                    }
                }
            }

            if (game.keys[39] || game.keys[68]) {
                if (!game.gameOver && !game.gameWon) {
                    if (game.player.x + 100 <= game.width) {
                        game.player.x += game.player.speed;
                        game.player.rendered = false;
                    }
                }
            }
        }

        function moverEnemigos() {
            if (game.count % game.division == 0) {
                game.left = !game.left;
            }

            for (i in game.enemies) {
                if (!game.moving) {
                    if (game.left) {
                        game.enemies[i].x -= game.enemieSpeed;
                    } else {
                        game.enemies[i].x += game.enemieSpeed;
                    }
                }
                if (game.moving) {
                    game.enemies[i].y++;
                }
                if (game.enemies[i].y >= game.height) {
                    game.gameOver = true;
                }
            }
        }

        function moverBalas() {
            for (i in game.projectiles) {
                game.projectiles[i].y -= 3;
                if (game.projectiles[i].y <= -game.projectiles[i].height) {
                    game.projectiles.splice(i, 1);
                }
            }
            if (game.keys[72] && game.shootTimer <= 0) {
                addBullet();
                game.shootTimer = game.fullShootTimer;
            }
        }

        function detectarColision() {
            for (m in game.enemies) {
                for (p in game.projectiles) {
                    if (collision(game.enemies[m], game.projectiles[p])) {
                        game.enemies[m].dead = true;
                        game.enemies[m].imageY = 342,
                            game.enemies[m].imageWidth = 184,
                            game.enemies[m].imageHeight = 172,
                            game.projectiles.splice(p, 1);
                    }
                }
            }
        }

        function matarEnemigo() {
            for (i in game.enemies) {
                if (game.enemies[i].dead) {
                    game.enemies[i].deadTime--;
                }
                if (game.enemies[i].dead && game.enemies[i].deadTime <= 0) {
                    game.enemies.splice(i, 1);
                }
            }
        }

        function update() {
            addStars(1); // AÑADE UNA ESTRELLA
            game.count++;

            if (game.shootTimer > 0) game.shootTimer--;

            moverEstrellas();

            moverJugador();

            moverEnemigos();

            moverBalas();

            detectarColision();

            matarEnemigo();

            if (game.enemies.length <= 0) {
                game.gameWon = true;
            }
        }

        function pintarFondo() {
            game.contextBackground.clearRect(0, 0, game.width, game.height); // LIMPIA LA PANTALLA PARA EVITAR CORRIMIENTOS
            game.contextBackground.fillStyle = "#FFF9C4"; // EL COLOR DEL CONTEXTO DEL FONDO (ESTRELLAS) LAS PINTA DE BLANCO
        }

        function pintarEstrellas() {
            for (i in game.stars) { // RECORRE DESDE LA PRIMERA ESTRELLA HASTA LA ULTIMA
                var star = game.stars[i]; // ALMACENA EN UNA VARIABLE LA ESTRELLA A DIBUJAR
                game.contextBackground.fillRect(star.x, star.y, star.size, star.size); // DIBUJA EN EL LIENZO LA ESTRELLA RESPECTIVA
            }
        }

        function pintarJugador() {
            game.contextPlayer.clearRect(0, game.player.y, game.width, game.height);
            game.contextPlayer.drawImage(game.images[0], 0, 135, 164, 206, game.player.x, game.player.y, game.player.width, game.player.height);
            game.player.rendered = true;
        }

        function pintarEnemigos() {
            game.contextEnemies.clearRect(0, 0, game.width, game.height);
            for (i in game.enemies) {
                enemy = game.enemies[i];
                game.contextEnemies.drawImage(game.images[0], enemy.imageX, enemy.imageY, enemy.imageWidth, enemy.imageHeight, enemy.x, enemy.y, enemy.width, enemy.height);
            }
        }

        function pintarBalas() {
            for (i in game.projectiles) {
                game.contextEnemies.clearRect(game.projectiles[i].x, game.projectiles[i].y, game.projectiles[i].width, game.projectiles[i].height);
                game.contextEnemies.drawImage(game.images[0], 0, 0, 37, 34, game.projectiles[i].x, game.projectiles[i].y, game.projectiles[i].width, game.projectiles[i].height);
            }
        }

        function mostrarJuegoPerdido() {
            game.contextBackground.font = "50px josefin sans";
            game.contextBackground.fillStyle = "white";
            game.contextBackground.fillText("GAME OVER", game.width / 2 - 140, game.height / 2);
        }

        function mostrarJuegoGanado() {
            game.contextBackground.font = "50px josefin sans";
            game.contextBackground.fillStyle = "white";
            game.contextBackground.fillText("CONGRATULATIONS", 40, game.height / 2);
        }

        function render() {
            pintarFondo();

            pintarEstrellas();

            if (!game.player.rendered) { // SE EJECUTA EN CASO DE QUE SE HALLA MOVIDO AL JUGADOR SI NO SE MUEVE NO SE RENDERIZA
                pintarJugador();
            }

            pintarEnemigos();

            pintarBalas();

            if (game.gameOver) {
                mostrarJuegoPerdido();
            }
            if (game.gameWon) {
                mostrarJuegoGanado();
            }
        }

        function loop() { // FUNCION QUE EJECUTA EL BUCLE DE REDIBUJADO
            requestAnimFrame(function() { // FUNCION QUE SE EJECUTARA VARIAS VECES PARA REDIBUJAR
                loop(); // SE EJECUTA A LA PROXIMA VECES QUE SE ACEPTE REQUESTANIMFRAME
            });
            update(); // ACTUALIZA AL SIGUIENTE REDIBUJADO
            render();
        }

        function initImages(paths) {
            game.requiredImages = paths.length;
            for (i in paths) {
                var img = new Image;
                img.src = paths[i];
                game.images[i] = img;
                game.images[i].onload = function() {
                    game.doneImages++;
                };
            }
        }

        function collision(first, second) {
            return !(first.x > second.x + second.width ||
                first.x + first.width < second.x ||
                first.y > second.y + second.height ||
                first.y + first.height < second.y);
        }

        function checkImages() {
            if (game.doneImages >= game.requiredImages) {
                init();
            } else {
                setTimeout(function() {
                    checkImages();
                }, 1);
            }
        }

        function mostrarCargando() {
            game.contextBackground.font = "50px josefin sans";
            game.contextBackground.fillStyle = "white";
            game.contextBackground.fillText("LOADING", game.width / 2 - 100, game.height / 2);
        }

        function main() {
            initImages(["img/sprites.png"]);
            checkImages();
        }

        main();
    });
})();

window.requestAnimFrame = (function() { // FUNCION QUE ANIMARA EN EL CANVAS
    return window.requestAnimationFrame || // RETORNA LA RESPUESTA PARA ANIMAR
        window.webkitRequestAnimationFrame || // RETORNA LA RESPUESTA PARA ANIMAR EN FIREFOX O CHROME
        window.mozRequestAnimationFrame || // RETORNA LA RESPUESTA PARA ANIMAR EN MOZILLA
        window.oRequestAnimationFrame || // RETORNA LA RESPUESTA PARA ANIMAR EN OPERA
        window.msRequestAnimationFrame || // RETORNA LA RESPUESTA PARA ANIMAR EN EXPLORER
        function(callback) { // SE EJECUTA SI NO ES NINGUNO DE LOS NAVEGADORES ANTERIORES
            window.setTimeout(callback, 1000 / 60); // DIBUJARA 60 FOTOGRAMAS POR SEGUNDO
        };
})();