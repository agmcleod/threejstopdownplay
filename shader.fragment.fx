// TE scanline effect
// some code by iq, extended to make it look right

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 vUV;

// replace this
uniform sampler2D textureSampler;

void main() {
    vec4 cTextureScreen = texture2D( textureSampler, vUV );
    float x = vUV.x * vUV.y * time *  1000.0;
    x = mod( x, 13.0 ) * mod( x, 123.0 );
    float dx = mod( x, 0.01 );
    vec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx * 100.0, 0.0, 1.0 );
    vec2 sc = vec2( sin( vUV.y * 4096.0 ), cos( vUV.y * 4096.0 ) );
    cResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * 0.05;
    cResult = cTextureScreen.rgb + clamp( 0.5, 0.0, 1.0 ) * ( cResult - cTextureScreen.rgb );
    gl_FragColor = vec4( cResult, cTextureScreen.a );
}