(function() {
  var $, D2R, D_E_B_U_G, MouseAndTouch, PI2, R2D, SCALE, S_T_A_R_T_E_D, b2AABB, b2Body, b2BodyDef, b2CircleShape, b2DebugDraw, b2Fixture, b2FixtureDef, b2MassData, b2MouseJointDef, b2PolygonShape, b2RevoluteJointDef, b2Vec2, b2World, createBox, createCircle, createDOMObjects, default_density, default_friction, default_restitution, default_shape, default_static, downHandler, drawDOMObjects, getBodyAtMouse, getBodyCB, getElementPosition, hw, interval, isMouseDown, mouseJoint, mousePVec, mouseX, mouseY, moveHandler, selectedBody, startWorld, upHandler, update, updateMouseDrag, world, x_velocity, y_velocity;

  b2Vec2 = Box2D.Common.Math.b2Vec2;

  b2AABB = Box2D.Collision.b2AABB;

  b2BodyDef = Box2D.Dynamics.b2BodyDef;

  b2Body = Box2D.Dynamics.b2Body;

  b2FixtureDef = Box2D.Dynamics.b2FixtureDef;

  b2Fixture = Box2D.Dynamics.b2Fixture;

  b2World = Box2D.Dynamics.b2World;

  b2MassData = Box2D.Collision.Shapes.b2MassData;

  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

  b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;

  b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

  b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

  b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;

  $ = jQuery;

  hw = {
    '-webkit-transform': 'translateZ(0)',
    '-moz-transform': 'translateZ(0)',
    '-o-transform': 'translateZ(0)',
    'transform': 'translateZ(0)'
  };

  S_T_A_R_T_E_D = false;

  D_E_B_U_G = false;

  world = {};

  x_velocity = 0;

  y_velocity = 0;

  SCALE = 30;

  D2R = Math.PI / 180;

  R2D = 180 / Math.PI;

  PI2 = Math.PI * 2;

  interval = {};

  default_static = false;

  default_density = 1.5;

  default_friction = 0.3;

  default_restitution = 0.4;

  default_shape = 'box';

  mouseX = 0;

  mouseY = 0;

  mousePVec = void 0;

  isMouseDown = false;

  selectedBody = void 0;

  mouseJoint = void 0;

  MouseAndTouch = function(dom, down, up, move) {
    var canvas, isDown, mouseDownHandler, mouseMoveHandler, mouseUpHandler, ret, startX, startY, touchDownHandler, touchUpHandler, updateFromEvent;
    canvas = dom;
    mouseX = void 0;
    mouseY = void 0;
    startX = void 0;
    startY = void 0;
    isDown = false;
    mouseMoveHandler = function(e) {
      updateFromEvent(e);
      return move(mouseX, mouseY);
    };
    updateFromEvent = function(e) {
      var touch;
      e.preventDefault();
      touch = e.originalEvent;
      if (touch && touch.touches && touch.touches.length === 1) {
        touch.preventDefault();
        mouseX = touch.touches[0].pageX;
        return mouseY = touch.touches[0].pageY;
      } else {
        mouseX = e.pageX;
        return mouseY = e.pageY;
      }
    };
    mouseUpHandler = function(e) {
      canvas.addEventListener("mousedown", mouseDownHandler, true);
      canvas.removeEventListener("mousemove", mouseMoveHandler, true);
      isDown = false;
      updateFromEvent(e);
      return up(mouseX, mouseY);
    };
    touchUpHandler = function(e) {
      canvas.addEventListener("touchstart", touchDownHandler, true);
      canvas.removeEventListener("touchmove", mouseMoveHandler, true);
      isDown = false;
      updateFromEvent(e);
      return up(mouseX, mouseY);
    };
    mouseDownHandler = function(e) {
      canvas.removeEventListener("mousedown", mouseDownHandler, true);
      canvas.addEventListener("mouseup", mouseUpHandler, true);
      canvas.addEventListener("mousemove", mouseMoveHandler, true);
      isDown = true;
      updateFromEvent(e);
      return down(mouseX, mouseY);
    };
    touchDownHandler = function(e) {
      canvas.removeEventListener("touchstart", touchDownHandler, true);
      canvas.addEventListener("touchend", touchUpHandler, true);
      canvas.addEventListener("touchmove", mouseMoveHandler, true);
      isDown = true;
      updateFromEvent(e);
      return down(mouseX, mouseY);
    };
    canvas.addEventListener("mousedown", mouseDownHandler, true);
    canvas.addEventListener("touchstart", touchDownHandler, true);
    ret = {};
    ret.mouseX = function() {
      return mouseX;
    };
    ret.mouseY = function() {
      return mouseY;
    };
    ret.isDown = function() {
      return isDown;
    };
    return ret;
  };

  downHandler = function(x, y) {
    isMouseDown = true;
    return moveHandler(x, y);
  };

  upHandler = function(x, y) {
    isMouseDown = false;
    mouseX = null;
    return mouseY = null;
  };

  moveHandler = function(x, y) {
    mouseX = x / 30;
    return mouseY = y / 30;
  };

  getBodyAtMouse = function() {
    var aabb;
    mousePVec = new b2Vec2(mouseX, mouseY);
    aabb = new b2AABB();
    aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
    aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);
    selectedBody = null;
    world.QueryAABB(getBodyCB, aabb);
    return selectedBody;
  };

  getBodyCB = function(fixture) {
    if (fixture.GetBody().GetType() !== b2Body.b2_staticBody) {
      if (fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
        selectedBody = fixture.GetBody();
        return false;
      }
    }
    return true;
  };

  getElementPosition = function(element) {
    var elem, tagname, x, y;
    elem = element;
    tagname = "";
    x = 0;
    y = 0;
    while ((typeof elem === "object") && (typeof elem.tagName !== "undefined")) {
      y += elem.offsetTop;
      x += elem.offsetLeft;
      tagname = elem.tagName.toUpperCase();
      if (tagname === "BODY") {
        elem = 0;
      }
      if (typeof elem === "object" ? typeof elem.offsetParent === "object" : void 0) {
        elem = elem.offsetParent;
      }
    }
    return {
      x: x,
      y: y
    };
  };

  updateMouseDrag = function() {
    var body, md;
    if (isMouseDown && (!mouseJoint)) {
      body = getBodyAtMouse();
      if (body) {
        md = new b2MouseJointDef();
        md.bodyA = world.GetGroundBody();
        md.bodyB = body;
        md.target.Set(mouseX, mouseY);
        md.collideConnected = true;
        md.maxForce = 300.0 * body.GetMass();
        mouseJoint = world.CreateJoint(md);
        body.SetAwake(true);
      }
    }
    if (mouseJoint) {
      if (isMouseDown) {
        return mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
      } else {
        world.DestroyJoint(mouseJoint);
        return mouseJoint = null;
      }
    }
  };

  createDOMObjects = function(jquery_selector, shape, static_, density, restitution, friction) {
    if (shape == null) {
      shape = default_shape;
    }
    if (static_ == null) {
      static_ = default_static;
    }
    if (density == null) {
      density = default_density;
    }
    if (restitution == null) {
      restitution = default_restitution;
    }
    if (friction == null) {
      friction = default_friction;
    }
    return $(jquery_selector).each(function(a, b) {
      var body, domObj, domPos, full_height, full_width, height, make_density, make_friction, make_restitution, make_shape, make_static, origin_values, r, width, x, y;
      domObj = $(b);
      full_width = domObj.width();
      full_height = domObj.height();
      if (!(full_width && full_height)) {
        if (domObj.attr('src')) {
          if (typeof console !== "undefined" && console !== null) {
            console.log(' - box2d-jquery ERROR: an element withour width or height, will lead to strangeness!');
          }
          domObj.on('load', function() {
            return createDOMObjects(this, shape, static_, density, restitution, friction);
          });
        }
        return true;
      }
      domPos = $(b).position();
      width = full_width / 2;
      height = full_height / 2;
      x = domPos.left + width;
      y = domPos.top + height;
      make_shape = (domObj.attr('box2d-shape') ? domObj.attr('box2d-shape') : shape);
      make_density = parseFloat((domObj.attr('box2d-density') ? domObj.attr('box2d-density') : density));
      make_restitution = parseFloat((domObj.attr('box2d-restitution') ? domObj.attr('box2d-restitution') : restitution));
      make_friction = parseFloat((domObj.attr('box2d-friction') ? domObj.attr('box2d-friction') : friction));
      if (domObj.attr('box2d-static') === "true") {
        make_static = true;
      } else if (domObj.attr('box2d-static') === "false") {
        make_static = false;
      } else {
        make_static = static_;
      }
      if (make_shape && make_shape !== 'circle') {
        body = createBox(x, y, width, height, make_static, make_density, make_restitution, make_friction);
      } else {
        r = (width > height ? width : height);
        body = createCircle(x, y, r, make_static, make_density, make_restitution, make_friction);
      }
      body.m_userData = {
        domObj: domObj,
        width: width,
        height: height
      };
      origin_values = '50% 50% 0';
      domObj.css({
        "-webkit-transform-origin": origin_values,
        "-moz-transform-origin": origin_values,
        "-ms-transform-origin": origin_values,
        "-o-transform-origin": origin_values,
        "transform-origin": origin_values
      });
      return true;
    });
  };

  createBox = function(x, y, width, height, static_, density, restitution, friction) {
    var bodyDef, fixDef;
    if (static_ == null) {
      static_ = default_static;
    }
    if (density == null) {
      density = default_density;
    }
    if (restitution == null) {
      restitution = default_restitution;
    }
    if (friction == null) {
      friction = default_friction;
    }
    bodyDef = new b2BodyDef;
    bodyDef.type = (static_ ? b2Body.b2_staticBody : b2Body.b2_dynamicBody);
    bodyDef.position.x = x / SCALE;
    bodyDef.position.y = y / SCALE;
    fixDef = new b2FixtureDef;
    fixDef.density = density;
    fixDef.friction = friction;
    fixDef.restitution = restitution;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(width / SCALE, height / SCALE);
    return world.CreateBody(bodyDef).CreateFixture(fixDef);
  };

  createCircle = function(x, y, r, static_, density, restitution, friction) {
    var bodyDef, fixDef;
    if (static_ == null) {
      static_ = default_static;
    }
    if (density == null) {
      density = default_density;
    }
    if (restitution == null) {
      restitution = default_restitution;
    }
    if (friction == null) {
      friction = default_friction;
    }
    bodyDef = new b2BodyDef;
    bodyDef.type = (static_ ? b2Body.b2_staticBody : b2Body.b2_dynamicBody);
    bodyDef.position.x = x / SCALE;
    bodyDef.position.y = y / SCALE;
    fixDef = new b2FixtureDef;
    fixDef.density = density;
    fixDef.friction = friction;
    fixDef.restitution = restitution;
    fixDef.shape = new b2CircleShape(r / SCALE);
    return world.CreateBody(bodyDef).CreateFixture(fixDef);
  };

  /*
  
  fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
  
        bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_dynamicBody;
        fixDef.shape = new b2CircleShape(10 / SCALE);
  
        bodyDef.position.x = 100 / SCALE;
        bodyDef.position.y = 10 / SCALE;
        world.CreateBody(bodyDef).CreateFixture(fixDef);
  */


  drawDOMObjects = function() {
    var b, css, f, i, r, translate_values, x, y, _results;
    i = 0;
    b = world.m_bodyList;
    _results = [];
    while (b) {
      f = b.m_fixtureList;
      while (f) {
        if (f.m_userData) {
          x = Math.floor((f.m_body.m_xf.position.x * SCALE) - f.m_userData.width);
          y = Math.floor((f.m_body.m_xf.position.y * SCALE) - f.m_userData.height);
          r = Math.round(((f.m_body.m_sweep.a + PI2) % PI2) * R2D * 100) / 100;
          translate_values = "rotate(" + r + "deg)";
          css = {
            "-webkit-transform": translate_values,
            "-moz-transform": translate_values,
            "-ms-transform": translate_values,
            "-o-transform": translate_values,
            "transform": translate_values,
            "left": x + "px",
            "top": y + "px"
          };
          f.m_userData.domObj.css(css);
        }
        f = f.m_next;
      }
      _results.push(b = b.m_next);
    }
    return _results;
  };

  update = function() {
    updateMouseDrag();
    world.Step(2 / 60, 8, 3);
    drawDOMObjects();
    if (D_E_B_U_G) {
      world.DrawDebugData();
    }
    world.ClearForces();
    return window.setTimeout(update, 1000 / 30);
  };

  startWorld = function(jquery_selector, density, restitution, friction) {
    var canvas, debugDraw, h, mouse, w;
    if (density == null) {
      density = default_density;
    }
    if (restitution == null) {
      restitution = default_restitution;
    }
    if (friction == null) {
      friction = default_friction;
    }
    S_T_A_R_T_E_D = true;
    world = new b2World(new b2Vec2(x_velocity, y_velocity), true);
    w = $(window).width();
    h = $(window).height();
    createBox(0, -1, $(window).width(), 1, true, density, restitution, friction);
    createBox($(window).width() + 1, 0, 1, $(window.document).height(), true, density, restitution, friction);
    createBox(-1, 0, 1, $(window.document).height(), true, density, restitution, friction);
    createBox(0, $(window.document).height() + 1, $(window).width(), 1, true, density, restitution, friction);
    mouse = MouseAndTouch(document, downHandler, upHandler, moveHandler);
    if (D_E_B_U_G) {
      debugDraw = new b2DebugDraw();
      canvas = $('<canvas></canvas>');
      debugDraw.SetSprite(canvas[0].getContext("2d"));
      debugDraw.SetDrawScale(SCALE);
      debugDraw.SetFillAlpha(0.3);
      debugDraw.SetLineThickness(1.0);
      debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
      canvas.css('position', 'absolute');
      canvas.css('top', 0);
      canvas.css('left', 0);
      canvas.css('border', '1px solid green');
      canvas.attr('width', $(window).width());
      canvas.attr('height', $(document).height());
      world.SetDebugDraw(debugDraw);
      $('body').append(canvas);
    }
    return update();
  };

  $.fn.extend({
    box2d: function(options) {
      var absolute_elements, debug, density, friction, opts, restitution, self, shape, static_;
      self = $.fn.box2d;
      opts = $.extend({}, self.default_options, options);
      x_velocity = opts['x-velocity'];
      y_velocity = opts['y-velocity'];
      density = opts['density'];
      restitution = opts['restitution'];
      friction = opts['friction'];
      shape = opts['shape'];
      static_ = opts['static'];
      debug = opts['debug'];
      if (S_T_A_R_T_E_D === false) {
        if (debug === true) {
          D_E_B_U_G = true;
        }
        startWorld(this, density, restitution, friction);
      }
      absolute_elements = this.bodysnatch();
      createDOMObjects(absolute_elements, shape, static_, density, restitution, friction);
      return $(absolute_elements);
    }
  });

  $.extend($.fn.physics, {
    default_options: {
      'x-velocity': 0,
      'y-velocity': 0,
      'density': default_density,
      'restitution': default_restitution,
      'friction': default_friction,
      'static': default_static,
      'shape': default_shape,
      'debug': D_E_B_U_G
    }
  });

}).call(this);
