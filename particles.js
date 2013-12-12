var nrParticles = 12, 		// Number of random particles
	radii = [4, 32],		// Radius range
	speeds = [-500, 500], 	// Speed range
	coefficient = 0.9, 		// Coefficient of restitution (c = 1 <=> elastic collision)

	colors = [ "#C63D0F", "#FDF3E7", "#7E8F7C", "#005A31", "#A8CD1B", "#CBE32D", "#F3FAB6", "#558C89", "#74AFAD", "#D9853B", "#2B2B2B","#DE1B1B", "#E9E581", "#7D1935", "#4A96AD", "#E44424", "#67BCDB", "#A2AB58", "#404040", "#6DBDD6", "#B71427", "#FFE658", "#118C4E", "#C1E1A6","#FF9009" ],
	particles = [],
	c = document.getElementById('particles'),
	c_width = c.width,
	c_height = c.height,
	c = c.getContext("2d");

/* 
 * Particle
 * 	Position [x, y] (px)
 * 	Color
 * 	Size (px)
 * 	Speed [x, y] (px/s)
 */
function Particle (position, color, radius, speed) {
	this.position = position;
	this.color = color;
	this.radius = radius;
	this.speed = speed;
	//this.collision = function () { return false; } // In case there will be other shapes
}

/*
 * 
 */
function frame () {
	var now = (new Date()).getTime(),
		diff = now - time,
		x, y, coll;
	time = now;

	c.fillStyle = "#FFF";
	c.fillRect(0, 0, c_width, c_height);
	c.fillStyle = "#000";

	for (var i = 0; i < particles.length; i++) {
		x = particles[i].position[0] + particles[i].speed[0] * diff / 1000;
		y = particles[i].position[1] + particles[i].speed[1] * diff / 1000;
		coll = collision(x, y, particles[i].radius);
		if (coll !== false) {
			//
			particles[i].speed[coll] = -1 * particles[i].speed[coll];
			// Inelastic collision
			particles[i].speed[0] *= coefficient;
			particles[i].speed[1] *= coefficient;
		} else {
			particles[i].position[0] = x;
			particles[i].position[1] = y;
		}

		c.fillStyle = particles[i].color;
		c.beginPath();
		c.arc(Math.round(particles[i].position[0]), Math.round(particles[i].position[1]), 
				particles[i].radius, 
				0, 2 * Math.PI);
		c.fill();
	}

	requestAnimationFrame(frame);
}

/*
 * Collision with canvas' borders
 * In case of collision return which component of speed vector to update. Otherwise return false.
 */
function collision (x, y, r) {
	if (x - r < 0 || x + r > c_width) {
		return 0;
	} else if (y - r < 0  || y + r > c_height) {
		return 1;
	} else {
		return false;
	}
}

/*
 * i, j integers AND i < j
 */
function randomRange (i, j) {
	return i + Math.floor(Math.random() * (j - i));
}

/*
 * i < j
 */
function randomRangeFloat (i, j) {
	return i + Math.random() * (j - i);
}

// Generate random particles
var j, k, l, m;
for (var i = 0; i < nrParticles; i++) {
	//j = [ Math.floor(Math.random() * c_width), Math.floor(Math.random() * c_height) ];
	k = colors[Math.floor(Math.random() * colors.length)];
	l = randomRange(radii[0], radii[1]);
	j = [ randomRange(l, c_width - l), randomRange(l, c_height - l) ]; // We need to make sure that particles don't get stuck on the border
	m = [ randomRangeFloat(speeds[0], speeds[1]), randomRangeFloat(speeds[0], speeds[1]) ]

	particles.push(new Particle(j, k, l, m));
}

// Let's go!
var start = (new Date()).getTime(),
	time = start;
frame();