var vs3luz = `#version 300 es

in vec4 a_position;
in vec3 a_normal;
in vec2 a_texcoord;

uniform vec3 u_lightWorldPosition0;
uniform vec3 u_viewWorldPosition;
uniform vec3 u_lightWorldPosition1;
uniform vec3 u_lightWorldPosition2;


uniform mat4 u_world;
uniform mat4 u_matrix;
uniform mat4 u_worldInverseTranspose;

out vec3 v_normal;
out vec3 v_surfaceToLight0;
out vec3 v_surfaceToView0;
out vec3 v_surfaceToLight1;
out vec3 v_surfaceToView1;
out vec3 v_surfaceToLight2;
out vec3 v_surfaceToView2;
out vec2 v_texcoord;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;
  
  v_normal = mat3(u_worldInverseTranspose) * (a_normal);
  vec3 surfaceWorldPosition = (u_world * a_position).xyz;
  v_surfaceToLight0 = u_lightWorldPosition0 - surfaceWorldPosition;
  v_surfaceToView0 = u_viewWorldPosition - surfaceWorldPosition;

  v_surfaceToLight1 = u_lightWorldPosition1 - surfaceWorldPosition;
  v_surfaceToView1 = u_viewWorldPosition - surfaceWorldPosition;

  v_surfaceToLight2 = u_lightWorldPosition2 - surfaceWorldPosition;
  v_surfaceToView2 = u_viewWorldPosition - surfaceWorldPosition;
  v_texcoord = a_texcoord;
}
`;

var fs3luz = `#version 300 es
precision highp float;

// Passed in from the vertex shader.
in vec3 v_normal;
in vec3 v_surfaceToLight0;
in vec3 v_surfaceToView0;
in vec3 v_surfaceToLight1;
in vec3 v_surfaceToView1;
in vec3 v_surfaceToLight2;
in vec3 v_surfaceToView2;
in vec2 v_texcoord;

uniform float u_shininess;

uniform vec3 u_lightColor0;
uniform vec3 u_specularColor0;

uniform vec3 u_lightColor1;
uniform vec3 u_specularColor1;

uniform vec3 u_lightColor2;
uniform vec3 u_specularColor2;

uniform sampler2D u_texture;

out vec4 outColor;

void main() {
  vec3 normal = normalize(v_normal);
  vec3 surfaceToLightDirection0 = normalize(v_surfaceToLight0);
  vec3 surfaceToViewDirection0 = normalize(v_surfaceToView0);

  vec3 surfaceToLightDirection1 = normalize(v_surfaceToLight1);
  vec3 surfaceToViewDirection1 = normalize(v_surfaceToView1);

  vec3 surfaceToLightDirection2 = normalize(v_surfaceToLight2);
  vec3 surfaceToViewDirection2 = normalize(v_surfaceToView2);

  vec3 halfVector0 = normalize(surfaceToLightDirection0 + surfaceToViewDirection0);
  float light0 = max(dot(v_normal, surfaceToLightDirection0),0.0);

  vec3 halfVector1 = normalize(surfaceToLightDirection1 + surfaceToViewDirection1);
  float light1 = max(dot(v_normal, surfaceToLightDirection1),0.0);

  vec3 halfVector2 = normalize(surfaceToLightDirection2 + surfaceToViewDirection2);
  float light2 = max(dot(v_normal, surfaceToLightDirection2),0.0);

  float specular0 = 0.0;
  float specular1 = 0.0;
  float specular2 = 0.0;

  outColor = texture(u_texture, v_texcoord);
  vec3 color0;
  vec3 color1;
  vec3 color2;
  vec3 spec0;
  vec3 spec1;
  vec3 spec2;

  specular0 = pow(dot(normal, halfVector0), u_shininess);
  specular1 = pow(dot(normal, halfVector1), u_shininess);
  specular2 = pow(dot(normal, halfVector2), u_shininess);

  if(light0>0.0){
  color0 = light0 * u_lightColor0;
  spec0 = specular0 * u_specularColor0;  
  }

  if(light1>0.0){
  color1 = light1 * u_lightColor1;
  spec1 = specular1 * u_specularColor1;
  }

  if(light2>0.0){
  color2 = light2 * u_lightColor2;
  spec2 = specular2 * u_specularColor2;
  }
  outColor.rgb *= (color0+color1+color2);
  outColor.rgb += spec0 + spec1 + spec2 ;
}
`;

var vs2luz = `#version 300 es

in vec4 a_position;
in vec3 a_normal;

uniform vec3 u_lightWorldPosition0;
uniform vec3 u_viewWorldPosition;
uniform vec3 u_lightWorldPosition1;
uniform vec3 u_lightWorldPosition2;


uniform mat4 u_world;
uniform mat4 u_matrix;
uniform mat4 u_worldInverseTranspose;

out vec3 v_normal;
out vec3 v_surfaceToLight0;
out vec3 v_surfaceToView0;
out vec3 v_surfaceToLight1;
out vec3 v_surfaceToView1;
out vec3 v_surfaceToLight2;
out vec3 v_surfaceToView2;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;
  
  v_normal = mat3(u_worldInverseTranspose) * (a_normal);
  vec3 surfaceWorldPosition = (u_world * a_position).xyz;
  v_surfaceToLight0 = u_lightWorldPosition0 - surfaceWorldPosition;
  v_surfaceToView0 = u_viewWorldPosition - surfaceWorldPosition;

  v_surfaceToLight1 = u_lightWorldPosition1 - surfaceWorldPosition;
  v_surfaceToView1 = u_viewWorldPosition - surfaceWorldPosition;
}
`;

var fs2luz = `#version 300 es
precision highp float;

// Passed in from the vertex shader.
in vec3 v_normal;
in vec3 v_surfaceToLight0;
in vec3 v_surfaceToView0;
in vec3 v_surfaceToLight1;
in vec3 v_surfaceToView1;

uniform vec4 u_color;
uniform float u_shininess;

uniform vec3 u_lightColor0;
uniform vec3 u_specularColor0;

uniform vec3 u_lightColor1;
uniform vec3 u_specularColor1;

out vec4 outColor;

void main() {
  vec3 normal = normalize(v_normal);
  vec3 surfaceToLightDirection1 = normalize(v_surfaceToLight0);
  vec3 surfaceToViewDirection1 = normalize(v_surfaceToView0);

  vec3 surfaceToLightDirection2 = normalize(v_surfaceToLight1);
  vec3 surfaceToViewDirection2 = normalize(v_surfaceToView1);

  vec3 halfVector0 = normalize(surfaceToLightDirection1 + surfaceToViewDirection1);
  float light1 = max(dot(v_normal, surfaceToLightDirection1),0.0);

  vec3 halfVector1 = normalize(surfaceToLightDirection2 + surfaceToViewDirection2);
  float light2 = max(dot(v_normal, surfaceToLightDirection2),0.0);

  float specular0 = 0.0;
  float specular1 = 0.0;

  outColor = u_color;
  vec3 color0;
  vec3 color1;
  vec3 spec0;
  vec3 spec1;

  float lightf=0.0;
  float specularf=0.0;

  specular0 = pow(dot(normal, halfVector0), u_shininess);
  specular1 = pow(dot(normal, halfVector1), u_shininess);
  if(light1>0.0){
  lightf += light1;
  color0 = light1 * u_lightColor0;
  spec0 = specular0 * u_specularColor0;
  specularf += specular0;
  }
  if(light2>0.0){
    lightf += light2;
    color1 = light2 * u_lightColor1;
    spec1 = specular1 * u_specularColor1;
    specularf += specular1;
    }
    
  // outColor.rgb *= lightf * u_lightColor0;
  // outColor.rgb += specularf * u_specularColor0;
  // outColor.rgb *= lightf * u_lightColor1;
  // outColor.rgb += specularf * u_specularColor1;
  // outColor.rgb *= color0+color1+spec0+spec1;
   outColor.rgb *= color0+color1;
  outColor.rgb += spec0  ;
}
`;

var vs = `#version 300 es

in vec4 a_position;
in vec3 a_normal;

uniform vec3 u_lightWorldPosition;
uniform vec3 u_viewWorldPosition;
uniform mat4 u_world;
uniform mat4 u_matrix;
uniform mat4 u_worldInverseTranspose;

out vec3 v_normal;
out vec3 v_surfaceToLight;
out vec3 v_surfaceToView;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;


  v_normal = mat3(u_worldInverseTranspose) * a_normal;
  vec3 surfaceWorldPosition = (u_world * a_position).xyz;
  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
  v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
}
`;

var fs = `#version 300 es
precision highp float;

// Passed in from the vertex shader.
in vec3 v_normal;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;

uniform vec4 u_color;
uniform float u_shininess;

uniform vec3 u_lightColor;
uniform vec3 u_specularColor;

out vec4 outColor;

void main() {
  vec3 normal = normalize(v_normal);
  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);
  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);
  float light = dot(v_normal, surfaceToLightDirection);
  float specular = 0.0;
  if (light > 0.0) {
    specular = pow(dot(normal, halfVector), u_shininess);
  }
  outColor = u_color;

  outColor.rgb *= light * u_lightColor;
  outColor.rgb += specular * u_specularColor;;
}
`;

var vsw = `
attribute vec4 a_position;
attribute vec3 a_barycentric;
uniform mat4 u_matrix;
varying vec3 vbc;

void main() {
  vbc = a_barycentric;
  gl_Position = u_matrix * a_position;
}`;

var fsw = `
precision mediump float;
varying vec3 vbc;

void main() {
  if(vbc.x < 0.03 || vbc.y < 0.03 || vbc.z < 0.03) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } 
  else {
    gl_FragColor = vec4(vbc.x, vbc.y, vbc.z, 1.0);
  }
}`;
