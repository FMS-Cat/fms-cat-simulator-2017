let canvasSize = 240;

let canvas = document.createElement( 'canvas' );
canvas.width = canvasSize;
canvas.height = canvasSize;

let context = canvas.getContext( '2d' );

let frames = 32;

// ------

let catColor = ( _theta ) => {
  let r = parseInt( Math.sin( _theta ) * 127 + 127 );
  let g = parseInt( Math.sin( _theta + Math.PI / 3.0 * 2.0 ) * 127 + 127 );
  let b = parseInt( Math.sin( _theta + Math.PI / 3.0 * 4.0 ) * 127 + 127 );
  return 'rgb(' + r + ',' + g + ',' + b + ')';
};

let drawBg = ( time ) => {
  let s = canvasSize / 20;
  
  for ( let iy = 0; iy < 20; iy ++ ) {
    for ( let ix = 0; ix < 20; ix ++ ) {
      let len = Math.sqrt( Math.pow( ( ix - 9.5 ), 2.0 ) + Math.pow( ( iy - 9.5 ), 2.0 ) );
      context.fillStyle = catColor( len - time * Math.PI * 8.0 );

      let x = ix * s;
      let y = iy * s;
      context.fillRect( x, y, s, s );
    }
  }
};

let drawFg = ( time, image ) => {
  let max = Math.max( image.width, image.height );
  let size = 0.8 + Math.sin( time * Math.PI * 2.0 ) * 0.1;
  let wid = image.width / max * size * canvasSize;
  let hei = image.height / max * size * canvasSize;

  context.drawImage(
    image,
    ( canvasSize - wid ) * 0.5,
    ( canvasSize - hei ) * 0.5,
    wid,
    hei
  );
};

let createGif = ( image ) => {
  let gif = new GIF( {
    workers: 2,
    width: canvasSize,
    height: canvasSize,
    quality: 1
  } );

  for ( let iFrame = 1; iFrame <= frames; iFrame ++ ) {
    let time = iFrame / frames;
    drawBg( time );
    drawFg( time, image );
    gif.addFrame( context, { delay: 40, copy: true } );
  }

  gif.on( 'finished', ( blob ) => {
    outImage.src = URL.createObjectURL( blob );
    divProgress.innerText = 'Done!';
  } );
  gif.on( 'progress', ( progress ) => {
    let dot = 1 + ( Math.floor( progress * 32 ) % 3 );
    divProgress.innerText = 'Simulating' + ( '...' ).substring( 0, dot );
  } );
  gif.render();
};

// ------

file.onchange = ( _event ) => {
  let files = file.files;

  let reader = new FileReader();
  reader.onload = () => {
    let image = new Image();
    image.onload = () => {
      createGif( image );
    }
    image.src = reader.result;
  }
  reader.readAsDataURL( files[ 0 ] );
};
