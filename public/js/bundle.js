var REPLApp = (function (exports) {
  'use strict';

  const rels = {};
  const codes$1 = {
    "{}": {
      code: "product",
      product: {},
    },
  };

  const identity = {
    op: "identity",
  };

  function is_identity_rel(rel) {
    return rel.op === "identity";
  }

  function is_constant_rel(rel) {
    switch (rel.op) {
      case "int":
      case "str":
        return true;
      case "vector":
        return Object.values(rel[rel.op]).every(is_constant_rel);
      case "product":
        return Object.values(rel[rel.op]).every(({ exp }) =>
          is_constant_rel(exp)
        );
      default:
        return false;
    }
  }

  function is_empty_rel(rel) {
    return rel.op === "union" && rel.union.length === 0;
  }

  function is_full_rel(rel) {
    if (is_constant_rel(rel)) return true;
    switch (rel.op) {
      case "int":
      case "str":
      case "identity":
        return true;
      case "comp":
        return rel.comp.every(is_full_rel);
      case "vector":
        return Object.values(rel[rel.op]).every(is_full_rel);
      case "product":
        return Object.values(rel[rel.op]).every(({ exp }) => is_full_rel(exp));
      default:
        return false;
    }
  }

  function comp_first(e1, e2) {
    if (is_identity_rel(e1)) return e2;
    if (is_identity_rel(e2)) return e1;
    if (is_empty_rel(e1)) return e1;
    // if (is_empty_rel(e2)) return e2;
    if (e1.op === "comp" && e2.op === "comp") {
      return {
        op: "comp",
        comp: [].concat(e1.comp, e2.comp),
      };
    }
    if (e1.op === "comp") {
      return {
        op: "comp",
        comp: [].concat(e1.comp, [e2]),
      };
    }
    if (e2.op === "comp") {
      return {
        op: "comp",
        comp: [].concat([e1], e2.comp),
      };
    }
    return {
      op: "comp",
      comp: [e1, e2],
    };
  }

  function comp (e1, e2)  {
    const result = comp_first(e1, e2);
    if (result.op !== "comp") return result;
    result.comp = result.comp.reduceRight(
      (c, e) => (c[0] && is_constant_rel(c[0]) && is_full_rel(e) ? c : [e, ...c]),
      []
    );
    return result;
  }

  function union  (rels) {
    const list = [];
    for (const rel of rels) {
      const new_rels = rel.op === "union" ? rel.union : [rel];
      for (const new_rel of new_rels) {
        list.push(new_rel);
        // if (is_full_rel(new_rel)) break label;
      }
    }
    if (list.length === 1) return list[0];
    return {
      op: "union",
      union: list,
    };
  }
  function as_ref (codeExp) {
    if (codeExp.code === "ref") return codeExp.ref;
    const newName = `:${Object.keys(codes$1).length}`;
    codes$1[newName] = codeExp;
    return newName;
  }
  function add_rel (name, rel) {
    if (rels[name] == null) rels[name] = [];
    rels[name].push(rel);
  }
  function add_code (name, code) {
    codes$1[name] = code;
  }

  var s = {
    identity,
    comp,
    union,
    rels,
    codes: codes$1,
    add_rel,
    add_code,
    as_ref,
  };

  function getToken(yytext,yy,lstack) {
      yy.lexer.yylloc;
      const loc = lstack[lstack.length - 1]; //  { first_line: 5, last_line: 5, first_column: 2, last_column: 3 };
      const start = {line: loc.first_line, column: loc.first_column + 1};
      const end = {line: start.line, column: start.column + yytext.length};
      const result = {start,end,value: String(yytext)};
      // console.log(result);
      return result;
  }

  function fromEscString(escString) {
    const isSingleQuoted = escString.startsWith("'");
    let str = escString.substring(1, escString.length - 1);
    if (isSingleQuoted) {
      str = str.replace(/\\'/g, "'");
    } else {
      str = str.replace(/\\"/g, '"');
    }
    str = str.replace(/\\\\/g, '\\');
    str = str.replace(/\\\//g, '/');
    str = str.replace(/\\b/g, '\b');
    str = str.replace(/\\f/g, '\f');
    str = str.replace(/\\n/g, '\n');
    str = str.replace(/\\r/g, '\r');
    str = str.replace(/\\t/g, '\t');
    str = str.replace(/\\u([\dA-F]{4})/gi, (match, p1) => String.fromCharCode(parseInt(p1, 16)));

    return str;
  }



  var parser = (function(){
  var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[4,6,8,10,12,14,16,28,36,50],$V1=[1,7],$V2=[1,21],$V3=[1,22],$V4=[1,19],$V5=[1,17],$V6=[1,18],$V7=[1,20],$V8=[1,23],$V9=[1,8],$Va=[1,16],$Vb=[1,26],$Vc=[4,6,8,10,12,14,16,28,36,40,47,50],$Vd=[2,43],$Ve=[1,30],$Vf=[4,6,8,10,12,14,16,18,20,22,24,28,30,32,36,40,47,50],$Vg=[2,63],$Vh=[1,50],$Vi=[2,46],$Vj=[2,47],$Vk=[4,6,8,10,12,14,16,18,20,22,24,28,30,32,34,36,40,47,50],$Vl=[4,6,8],$Vm=[2,22],$Vn=[2,27],$Vo=[1,67],$Vp=[1,69],$Vq=[20,30],$Vr=[4,6,8,10,12,14,16,28,36,47,50],$Vs=[1,74],$Vt=[1,78],$Vu=[18,22,30],$Vv=[1,81],$Vw=[18,20,30],$Vx=[2,57],$Vy=[2,58],$Vz=[2,59];
  var parser = {trace: function trace () { },
  yy: {},
  symbols_: {"error":2,"name":3,"NAME":4,"str":5,"STRING":6,"int":7,"INT":8,"la":9,"LA":10,"lc":11,"LC":12,"lb":13,"LB":14,"lp":15,"LP":16,"ra":17,"RA":18,"rc":19,"RC":20,"rb":21,"RB":22,"rp":23,"RP":24,"eq":25,"EQ":26,"dot":27,"DOT":28,"comma":29,"COMMA":30,"sc":31,"SC":32,"col":33,"COL":34,"dollar":35,"DOLLAR":36,"input_with_eof":37,"defs":38,"comp":39,"EOF":40,"codeDef":41,"code":42,"labelled_codes":43,"non_empty_labelled_codes":44,"code_label":45,"exp":46,"CARET":47,"labelled":48,"list":49,"PIPE":50,"non_empty_labelled":51,"comp_label":52,"non_empty_list":53,"$accept":0,"$end":1},
  terminals_: {2:"error",4:"NAME",6:"STRING",8:"INT",10:"LA",12:"LC",14:"LB",16:"LP",18:"RA",20:"RC",22:"RB",24:"RP",26:"EQ",28:"DOT",30:"COMMA",32:"SC",34:"COL",36:"DOLLAR",40:"EOF",47:"CARET",50:"PIPE"},
  productions_: [0,[3,1],[5,1],[7,1],[9,1],[11,1],[13,1],[15,1],[17,1],[19,1],[21,1],[23,1],[25,1],[27,1],[29,1],[31,1],[33,1],[35,1],[37,3],[38,0],[38,5],[38,6],[42,1],[42,1],[41,3],[41,3],[41,3],[43,0],[43,1],[44,1],[44,3],[45,2],[45,2],[45,2],[45,3],[45,3],[45,3],[39,1],[39,2],[39,2],[46,3],[46,3],[46,3],[46,1],[46,2],[46,3],[46,1],[46,1],[46,2],[46,2],[46,2],[46,2],[46,1],[48,0],[48,1],[51,1],[51,3],[52,2],[52,2],[52,2],[52,3],[52,3],[52,3],[49,0],[49,1],[53,1],[53,3]],
  performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
  /* this == yyval */

  var $0 = $$.length - 1;
  switch (yystate) {
  case 1: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11: case 12: case 13: case 14: case 15: case 16: case 17:
   this.$ = getToken(yytext,yy,_$); 
  break;
  case 2:
   this.$ = getToken(yytext,yy,_$); this.$.value = fromEscString(this.$.value);
  break;
  case 3:
   this.$ = getToken(yytext,yy,_$); this.$.value = parseInt(this.$.value); 
  break;
  case 18:

      const result = {defs: {rels: s.rels, codes: s.codes}, exp: $$[$0-1]};
      // console.log(JSON.stringify(result, "", 2));
      return result;
  case 19:
    
  break;
  case 20:
   s.add_rel($$[$0-3].value,$$[$0-1]); 
  break;
  case 21:
   s.add_code($$[$0-3].value,$$[$0-1]); 
  break;
  case 22:
   this.$ = { code: "ref", ref: $$[$0].value, start: $$[$0].start, end: $$[$0].end}; 
  break;
  case 23: case 37: case 54: case 64:
   this.$ = $$[$0]; 
  break;
  case 24:
   this.$ = { code: "product", product: $$[$0-1], start: $$[$0-2].start, end: $$[$0].end }; 
  break;
  case 25:
   this.$ = { code: "vector", vector: s.as_ref($$[$0-1]), start: $$[$0-2].start, end: $$[$0].end }; 
  break;
  case 26:
   this.$ = { code: "union", union: $$[$0-1], start: $$[$0-2].start, end: $$[$0].end }; 
  break;
  case 27:
   this.$ = {}; 
  break;
  case 28:
   this.$ = $$[$0].reduce((r, lc) => { 
                                                    r[lc.label] = s.as_ref(lc.code);
                                                    return r }
                                                  , {}); 
  break;
  case 29: case 65:
   this.$ = [$$[$0]]; 
  break;
  case 30: case 66:
   this.$ = [].concat($$[$0-2],$$[$0]); 
  break;
  case 31: case 32: case 33:
   this.$ = {label: $$[$0].value, code: $$[$0-1]}; 
  break;
  case 34: case 35: case 36:
   this.$ = {label: $$[$0-2].value, code: $$[$0]}; 
  break;
  case 38:
   this.$ = {...s.comp($$[$0-1], $$[$0]), start: $$[$0-1].start, end:$$[$0].end}; 
  break;
  case 39:
   this.$ = {op: 'caret', caret: $$[$0-1]}; 
  break;
  case 40:
   this.$ = {...$$[$0-1], start: $$[$0-2].start, end: $$[$0].end}; 
  break;
  case 41:
   this.$ = {op: "vector", vector: $$[$0-1], start: $$[$0-2].start, end: $$[$0].end}; 
  break;
  case 42:
   this.$ = {...s.union($$[$0-1]), start: $$[$0-2].start, end: $$[$0].end}; 
  break;
  case 43:
   this.$ = {op: "ref", ref: $$[$0].value, start: $$[$0].start, end: $$[$0].end}; 
  break;
  case 44:
   this.$ = {...s.identity, start: $$[$0-1].start, end: $$[$0].end};  
  break;
  case 45:
   this.$ = {...$$[$0-1], start: $$[$0-2].start, end: $$[$0].end };  
  break;
  case 46:
   this.$ = {op: "str", str: $$[$0].value, start: $$[$0].start, end: $$[$0].end }; 
  break;
  case 47:
   this.$ = {op: "int", int: $$[$0].value, start: $$[$0].start, end: $$[$0].end }; 
  break;
  case 48: case 49: case 50:
   this.$ = {op: "dot", dot: $$[$0].value, start: $$[$0-1].start, end: $$[$0].end }; 
  break;
  case 51:
   this.$ = {op: "code", code: s.as_ref($$[$0]), start: $$[$0-1].start, end: $$[$0].end}; 
  break;
  case 52:
   this.$ = {op: "pipe"}; 
  break;
  case 53:
   this.$ = {op: "product", product: []}; 
  break;
  case 55:
   this.$ = {op: "product", product: [$$[$0]]}; 
  break;
  case 56:
   $$[$0-2].product = [].concat($$[$0-2].product,$$[$0]); this.$ = $$[$0-2]; 
  break;
  case 57: case 58: case 59:
   this.$ = {label: $$[$0].value, exp: $$[$0-1]}; 
  break;
  case 60: case 61: case 62:
   this.$ = {label: $$[$0-2].value, exp: $$[$0]}; 
  break;
  case 63:
   this.$ = []; 
  break;
  }
  },
  table: [o($V0,[2,19],{37:1,38:2}),{1:[3]},{3:4,4:$V1,5:13,6:$V2,7:14,8:$V3,9:11,10:$V4,11:9,12:$V5,13:10,14:$V6,15:12,16:$V7,27:15,28:$V8,35:5,36:$V9,39:3,46:6,50:$Va},{3:27,4:$V1,5:13,6:$V2,7:14,8:$V3,9:11,10:$V4,11:9,12:$V5,13:10,14:$V6,15:12,16:$V7,27:15,28:$V8,35:28,36:$V9,40:[1,24],46:25,47:$Vb,50:$Va},o($Vc,$Vd,{25:29,26:$Ve}),{3:31,4:$V1,9:36,10:$V4,11:34,12:$V5,13:35,14:$V6,41:33,42:32},o($Vf,[2,37]),o([4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,40,47,50],[2,1]),o([4,10,12,14],[2,17]),{3:41,4:$V1,5:42,6:$V2,7:43,8:$V3,9:11,10:$V4,11:9,12:$V5,13:10,14:$V6,15:12,16:$V7,20:[2,53],27:15,28:$V8,35:28,36:$V9,39:40,46:6,48:37,50:$Va,51:38,52:39},{3:27,4:$V1,5:13,6:$V2,7:14,8:$V3,9:11,10:$V4,11:9,12:$V5,13:10,14:$V6,15:12,16:$V7,22:$Vg,27:15,28:$V8,35:28,36:$V9,39:46,46:6,49:44,50:$Va,53:45},{3:27,4:$V1,5:13,6:$V2,7:14,8:$V3,9:11,10:$V4,11:9,12:$V5,13:10,14:$V6,15:12,16:$V7,18:$Vg,27:15,28:$V8,35:28,36:$V9,39:46,46:6,49:47,50:$Va,53:45},{3:27,4:$V1,5:13,6:$V2,7:14,8:$V3,9:11,10:$V4,11:9,12:$V5,13:10,14:$V6,15:12,16:$V7,23:48,24:$Vh,27:15,28:$V8,35:28,36:$V9,39:49,46:6,50:$Va},o($Vf,$Vi),o($Vf,$Vj),{3:53,4:$V1,5:52,6:$V2,7:51,8:$V3},o($Vf,[2,52]),o([4,6,8,10,12,14,16,20,28,36,50],[2,5]),o([4,6,8,10,12,14,16,22,28,36,50],[2,6]),o([4,6,8,10,12,14,16,18,28,36,50],[2,4]),o([4,6,8,10,12,14,16,24,28,36,50],[2,7]),o($Vk,[2,2]),o($Vk,[2,3]),o($Vl,[2,13]),{1:[2,18]},o($Vf,[2,38]),o($Vf,[2,39]),o($Vf,$Vd),{3:54,4:$V1,9:36,10:$V4,11:34,12:$V5,13:35,14:$V6,41:33,42:32},{3:27,4:$V1,5:13,6:$V2,7:14,8:$V3,9:11,10:$V4,11:9,12:$V5,13:10,14:$V6,15:12,16:$V7,27:15,28:$V8,35:28,36:$V9,39:55,46:6,50:$Va},o($V0,[2,12]),o($Vc,$Vm,{25:56,26:$Ve}),o($Vf,[2,51]),o($Vf,[2,23]),{3:61,4:$V1,5:62,6:$V2,7:63,8:$V3,9:36,10:$V4,11:34,12:$V5,13:35,14:$V6,20:$Vn,41:33,42:60,43:57,44:58,45:59},{3:54,4:$V1,9:36,10:$V4,11:34,12:$V5,13:35,14:$V6,41:33,42:64},{3:61,4:$V1,5:62,6:$V2,7:63,8:$V3,9:36,10:$V4,11:34,12:$V5,13:35,14:$V6,18:$Vn,41:33,42:60,43:65,44:58,45:59},{19:66,20:$Vo},{20:[2,54],29:68,30:$Vp},o($Vq,[2,55]),{3:70,4:$V1,5:71,6:$V2,7:72,8:$V3,9:11,10:$V4,11:9,12:$V5,13:10,14:$V6,15:12,16:$V7,27:15,28:$V8,35:28,36:$V9,46:25,47:$Vb,50:$Va},o($Vr,$Vd,{33:73,34:$Vs}),o($Vr,$Vi,{33:75,34:$Vs}),o($Vr,$Vj,{33:76,34:$Vs}),{21:77,22:$Vt},o([18,22],[2,64],{29:79,30:$Vp}),o($Vu,[2,65],{11:9,13:10,9:11,15:12,5:13,7:14,27:15,46:25,3:27,35:28,4:$V1,6:$V2,8:$V3,10:$V4,12:$V5,14:$V6,16:$V7,28:$V8,36:$V9,47:$Vb,50:$Va}),{17:80,18:$Vv},o($Vf,[2,44]),{3:27,4:$V1,5:13,6:$V2,7:14,8:$V3,9:11,10:$V4,11:9,12:$V5,13:10,14:$V6,15:12,16:$V7,23:82,24:$Vh,27:15,28:$V8,35:28,36:$V9,46:25,47:$Vb,50:$Va},o($Vf,[2,11]),o($Vf,[2,48]),o($Vf,[2,49]),o($Vf,[2,50]),o($Vf,$Vm),{3:27,4:$V1,5:13,6:$V2,7:14,8:$V3,9:11,10:$V4,11:9,12:$V5,13:10,14:$V6,15:12,16:$V7,27:15,28:$V8,31:83,32:[1,84],35:28,36:$V9,46:25,47:$Vb,50:$Va},{9:36,10:$V4,11:34,12:$V5,13:35,14:$V6,41:85},{19:86,20:$Vo},o([18,20],[2,28],{29:87,30:$Vp}),o($Vw,[2,29]),{3:88,4:$V1,5:89,6:$V2,7:90,8:$V3},o($Vl,$Vm,{33:91,34:$Vs}),{33:92,34:$Vs},{33:93,34:$Vs},{21:94,22:$Vt},{17:95,18:$Vv},o($Vf,[2,40]),o($Vf,[2,9]),{3:41,4:$V1,5:42,6:$V2,7:43,8:$V3,9:11,10:$V4,11:9,12:$V5,13:10,14:$V6,15:12,16:$V7,27:15,28:$V8,35:28,36:$V9,39:40,46:6,50:$Va,52:96},o($V0,[2,14]),o($Vr,$Vd,{20:$Vx,30:$Vx}),o($Vr,$Vi,{20:$Vy,30:$Vy}),o($Vr,$Vj,{20:$Vz,30:$Vz}),{3:27,4:$V1,5:13,6:$V2,7:14,8:$V3,9:11,10:$V4,11:9,12:$V5,13:10,14:$V6,15:12,16:$V7,27:15,28:$V8,35:28,36:$V9,39:97,46:6,50:$Va},o($V0,[2,16]),{3:27,4:$V1,5:13,6:$V2,7:14,8:$V3,9:11,10:$V4,11:9,12:$V5,13:10,14:$V6,15:12,16:$V7,27:15,28:$V8,35:28,36:$V9,39:98,46:6,50:$Va},{3:27,4:$V1,5:13,6:$V2,7:14,8:$V3,9:11,10:$V4,11:9,12:$V5,13:10,14:$V6,15:12,16:$V7,27:15,28:$V8,35:28,36:$V9,39:99,46:6,50:$Va},o($Vf,[2,41]),o($Vf,[2,10]),{3:27,4:$V1,5:13,6:$V2,7:14,8:$V3,9:11,10:$V4,11:9,12:$V5,13:10,14:$V6,15:12,16:$V7,27:15,28:$V8,35:28,36:$V9,39:100,46:6,50:$Va},o($Vf,[2,42]),o($Vf,[2,8]),o($Vf,[2,45]),o($V0,[2,20]),o($V0,[2,15]),{32:[1,101]},o($Vf,[2,24]),{3:61,4:$V1,5:62,6:$V2,7:63,8:$V3,9:36,10:$V4,11:34,12:$V5,13:35,14:$V6,41:33,42:60,45:102},o($Vw,[2,31]),o($Vw,[2,32]),o($Vw,[2,33]),{3:54,4:$V1,9:36,10:$V4,11:34,12:$V5,13:35,14:$V6,41:33,42:103},{3:54,4:$V1,9:36,10:$V4,11:34,12:$V5,13:35,14:$V6,41:33,42:104},{3:54,4:$V1,9:36,10:$V4,11:34,12:$V5,13:35,14:$V6,41:33,42:105},o($Vf,[2,25]),o($Vf,[2,26]),o($Vq,[2,56]),o($Vq,[2,60],{11:9,13:10,9:11,15:12,5:13,7:14,27:15,46:25,3:27,35:28,4:$V1,6:$V2,8:$V3,10:$V4,12:$V5,14:$V6,16:$V7,28:$V8,36:$V9,47:$Vb,50:$Va}),o($Vq,[2,61],{11:9,13:10,9:11,15:12,5:13,7:14,27:15,46:25,3:27,35:28,4:$V1,6:$V2,8:$V3,10:$V4,12:$V5,14:$V6,16:$V7,28:$V8,36:$V9,47:$Vb,50:$Va}),o($Vq,[2,62],{11:9,13:10,9:11,15:12,5:13,7:14,27:15,46:25,3:27,35:28,4:$V1,6:$V2,8:$V3,10:$V4,12:$V5,14:$V6,16:$V7,28:$V8,36:$V9,47:$Vb,50:$Va}),o($Vu,[2,66],{11:9,13:10,9:11,15:12,5:13,7:14,27:15,46:25,3:27,35:28,4:$V1,6:$V2,8:$V3,10:$V4,12:$V5,14:$V6,16:$V7,28:$V8,36:$V9,47:$Vb,50:$Va}),o($V0,[2,21]),o($Vw,[2,30]),o($Vw,[2,34]),o($Vw,[2,35]),o($Vw,[2,36])],
  defaultActions: {24:[2,18]},
  parseError: function parseError (str, hash) {
      if (hash.recoverable) {
          this.trace(str);
      } else {
          var error = new Error(str);
          error.hash = hash;
          throw error;
      }
  },
  parse: function parse(input) {
      var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, TERROR = 2, EOF = 1;
      var args = lstack.slice.call(arguments, 1);
      var lexer = Object.create(this.lexer);
      var sharedState = { yy: {} };
      for (var k in this.yy) {
          if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
              sharedState.yy[k] = this.yy[k];
          }
      }
      lexer.setInput(input, sharedState.yy);
      sharedState.yy.lexer = lexer;
      sharedState.yy.parser = this;
      if (typeof lexer.yylloc == 'undefined') {
          lexer.yylloc = {};
      }
      var yyloc = lexer.yylloc;
      lstack.push(yyloc);
      var ranges = lexer.options && lexer.options.ranges;
      if (typeof sharedState.yy.parseError === 'function') {
          this.parseError = sharedState.yy.parseError;
      } else {
          this.parseError = Object.getPrototypeOf(this).parseError;
      }
      var lex = function () {
              var token;
              token = lexer.lex() || EOF;
              if (typeof token !== 'number') {
                  token = self.symbols_[token] || token;
              }
              return token;
          };
      var symbol, state, action, r, yyval = {}, p, len, newState, expected;
      while (true) {
          state = stack[stack.length - 1];
          if (this.defaultActions[state]) {
              action = this.defaultActions[state];
          } else {
              if (symbol === null || typeof symbol == 'undefined') {
                  symbol = lex();
              }
              action = table[state] && table[state][symbol];
          }
                      if (typeof action === 'undefined' || !action.length || !action[0]) {
                  var errStr = '';
                  expected = [];
                  for (p in table[state]) {
                      if (this.terminals_[p] && p > TERROR) {
                          expected.push('\'' + this.terminals_[p] + '\'');
                      }
                  }
                  if (lexer.showPosition) {
                      errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                  } else {
                      errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                  }
                  this.parseError(errStr, {
                      text: lexer.match,
                      token: this.terminals_[symbol] || symbol,
                      line: lexer.yylineno,
                      loc: yyloc,
                      expected: expected
                  });
              }
          if (action[0] instanceof Array && action.length > 1) {
              throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
          }
          switch (action[0]) {
          case 1:
              stack.push(symbol);
              vstack.push(lexer.yytext);
              lstack.push(lexer.yylloc);
              stack.push(action[1]);
              symbol = null;
              {
                  yyleng = lexer.yyleng;
                  yytext = lexer.yytext;
                  yylineno = lexer.yylineno;
                  yyloc = lexer.yylloc;
              }
              break;
          case 2:
              len = this.productions_[action[1]][1];
              yyval.$ = vstack[vstack.length - len];
              yyval._$ = {
                  first_line: lstack[lstack.length - (len || 1)].first_line,
                  last_line: lstack[lstack.length - 1].last_line,
                  first_column: lstack[lstack.length - (len || 1)].first_column,
                  last_column: lstack[lstack.length - 1].last_column
              };
              if (ranges) {
                  yyval._$.range = [
                      lstack[lstack.length - (len || 1)].range[0],
                      lstack[lstack.length - 1].range[1]
                  ];
              }
              r = this.performAction.apply(yyval, [
                  yytext,
                  yyleng,
                  yylineno,
                  sharedState.yy,
                  action[1],
                  vstack,
                  lstack
              ].concat(args));
              if (typeof r !== 'undefined') {
                  return r;
              }
              if (len) {
                  stack = stack.slice(0, -1 * len * 2);
                  vstack = vstack.slice(0, -1 * len);
                  lstack = lstack.slice(0, -1 * len);
              }
              stack.push(this.productions_[action[1]][0]);
              vstack.push(yyval.$);
              lstack.push(yyval._$);
              newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
              stack.push(newState);
              break;
          case 3:
              return true;
          }
      }
      return true;
  }};/* generated by jison-lex  */
  var lexer = (function(){
  var lexer = ({

  EOF:1,

  parseError:function parseError(str, hash) {
          if (this.yy.parser) {
              this.yy.parser.parseError(str, hash);
          } else {
              throw new Error(str);
          }
      },

  // resets the lexer, sets new input
  setInput:function (input, yy) {
          this.yy = yy || this.yy || {};
          this._input = input;
          this._more = this._backtrack = this.done = false;
          this.yylineno = this.yyleng = 0;
          this.yytext = this.matched = this.match = '';
          this.conditionStack = ['INITIAL'];
          this.yylloc = {
              first_line: 1,
              first_column: 0,
              last_line: 1,
              last_column: 0
          };
          if (this.options.ranges) {
              this.yylloc.range = [0,0];
          }
          this.offset = 0;
          return this;
      },

  // consumes and returns one char from the input
  input:function () {
          var ch = this._input[0];
          this.yytext += ch;
          this.yyleng++;
          this.offset++;
          this.match += ch;
          this.matched += ch;
          var lines = ch.match(/(?:\r\n?|\n).*/g);
          if (lines) {
              this.yylineno++;
              this.yylloc.last_line++;
          } else {
              this.yylloc.last_column++;
          }
          if (this.options.ranges) {
              this.yylloc.range[1]++;
          }

          this._input = this._input.slice(1);
          return ch;
      },

  // unshifts one char (or a string) into the input
  unput:function (ch) {
          var len = ch.length;
          var lines = ch.split(/(?:\r\n?|\n)/g);

          this._input = ch + this._input;
          this.yytext = this.yytext.substr(0, this.yytext.length - len);
          //this.yyleng -= len;
          this.offset -= len;
          var oldLines = this.match.split(/(?:\r\n?|\n)/g);
          this.match = this.match.substr(0, this.match.length - 1);
          this.matched = this.matched.substr(0, this.matched.length - 1);

          if (lines.length - 1) {
              this.yylineno -= lines.length - 1;
          }
          var r = this.yylloc.range;

          this.yylloc = {
              first_line: this.yylloc.first_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.first_column,
              last_column: lines ?
                  (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                   + oldLines[oldLines.length - lines.length].length - lines[0].length :
                this.yylloc.first_column - len
          };

          if (this.options.ranges) {
              this.yylloc.range = [r[0], r[0] + this.yyleng - len];
          }
          this.yyleng = this.yytext.length;
          return this;
      },

  // When called from action, caches matched text and appends it on next action
  more:function () {
          this._more = true;
          return this;
      },

  // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
  reject:function () {
          if (this.options.backtrack_lexer) {
              this._backtrack = true;
          } else {
              return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                  text: "",
                  token: null,
                  line: this.yylineno
              });

          }
          return this;
      },

  // retain first n characters of the match
  less:function (n) {
          this.unput(this.match.slice(n));
      },

  // displays already matched input, i.e. for error messages
  pastInput:function () {
          var past = this.matched.substr(0, this.matched.length - this.match.length);
          return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
      },

  // displays upcoming input, i.e. for error messages
  upcomingInput:function () {
          var next = this.match;
          if (next.length < 20) {
              next += this._input.substr(0, 20-next.length);
          }
          return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
      },

  // displays the character position where the lexing error occurred, i.e. for error messages
  showPosition:function () {
          var pre = this.pastInput();
          var c = new Array(pre.length + 1).join("-");
          return pre + this.upcomingInput() + "\n" + c + "^";
      },

  // test the lexed token: return FALSE when not a match, otherwise return token
  test_match:function(match, indexed_rule) {
          var token,
              lines,
              backup;

          if (this.options.backtrack_lexer) {
              // save context
              backup = {
                  yylineno: this.yylineno,
                  yylloc: {
                      first_line: this.yylloc.first_line,
                      last_line: this.last_line,
                      first_column: this.yylloc.first_column,
                      last_column: this.yylloc.last_column
                  },
                  yytext: this.yytext,
                  match: this.match,
                  matches: this.matches,
                  matched: this.matched,
                  yyleng: this.yyleng,
                  offset: this.offset,
                  _more: this._more,
                  _input: this._input,
                  yy: this.yy,
                  conditionStack: this.conditionStack.slice(0),
                  done: this.done
              };
              if (this.options.ranges) {
                  backup.yylloc.range = this.yylloc.range.slice(0);
              }
          }

          lines = match[0].match(/(?:\r\n?|\n).*/g);
          if (lines) {
              this.yylineno += lines.length;
          }
          this.yylloc = {
              first_line: this.yylloc.last_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.last_column,
              last_column: lines ?
                           lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                           this.yylloc.last_column + match[0].length
          };
          this.yytext += match[0];
          this.match += match[0];
          this.matches = match;
          this.yyleng = this.yytext.length;
          if (this.options.ranges) {
              this.yylloc.range = [this.offset, this.offset += this.yyleng];
          }
          this._more = false;
          this._backtrack = false;
          this._input = this._input.slice(match[0].length);
          this.matched += match[0];
          token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
          if (this.done && this._input) {
              this.done = false;
          }
          if (token) {
              return token;
          } else if (this._backtrack) {
              // recover context
              for (var k in backup) {
                  this[k] = backup[k];
              }
              return false; // rule action called reject() implying the next rule should be tested instead.
          }
          return false;
      },

  // return next match in input
  next:function () {
          if (this.done) {
              return this.EOF;
          }
          if (!this._input) {
              this.done = true;
          }

          var token,
              match,
              tempMatch,
              index;
          if (!this._more) {
              this.yytext = '';
              this.match = '';
          }
          var rules = this._currentRules();
          for (var i = 0; i < rules.length; i++) {
              tempMatch = this._input.match(this.rules[rules[i]]);
              if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                  match = tempMatch;
                  index = i;
                  if (this.options.backtrack_lexer) {
                      token = this.test_match(tempMatch, rules[i]);
                      if (token !== false) {
                          return token;
                      } else if (this._backtrack) {
                          match = false;
                          continue; // rule action called reject() implying a rule MISmatch.
                      } else {
                          // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                          return false;
                      }
                  } else if (!this.options.flex) {
                      break;
                  }
              }
          }
          if (match) {
              token = this.test_match(match, rules[index]);
              if (token !== false) {
                  return token;
              }
              // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
              return false;
          }
          if (this._input === "") {
              return this.EOF;
          } else {
              return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                  text: "",
                  token: null,
                  line: this.yylineno
              });
          }
      },

  // return next match that has a token
  lex:function lex () {
          var r = this.next();
          if (r) {
              return r;
          } else {
              return this.lex();
          }
      },

  // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
  begin:function begin (condition) {
          this.conditionStack.push(condition);
      },

  // pop the previously active lexer condition state off the condition stack
  popState:function popState () {
          var n = this.conditionStack.length - 1;
          if (n > 0) {
              return this.conditionStack.pop();
          } else {
              return this.conditionStack[0];
          }
      },

  // produce the lexer rule set which is active for the currently active lexer condition state
  _currentRules:function _currentRules () {
          if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
              return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
          } else {
              return this.conditions["INITIAL"].rules;
          }
      },

  // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
  topState:function topState (n) {
          n = this.conditionStack.length - 1 - Math.abs(n || 0);
          if (n >= 0) {
              return this.conditionStack[n];
          } else {
              return "INITIAL";
          }
      },

  // alias for begin(condition)
  pushState:function pushState (condition) {
          this.begin(condition);
      },

  // return the number of states currently on the stack
  stateStackSize:function stateStackSize() {
          return this.conditionStack.length;
      },
  options: {},
  performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
  switch($avoiding_name_collisions) {
  case 0:/* c-comment */
  break;
  case 1:/* one line comment */
  break;
  case 2:/* blanks */
  break;
  case 3:return 10;
  case 4:return 12;
  case 5:return 14;
  case 6:return 16;
  case 7:return 18;
  case 8:return 20;
  case 9:return 22;
  case 10:return 24;
  case 11:return 26; 
  case 12:return 28;
  case 13:return 30;
  case 14:return 32;
  case 15:return 34;
  case 16:return 36; 
  case 17:return 50;
  case 18:return 47;
  case 19:return 6;
  case 20:return 4;
  case 21:return 8;
  case 22:return 40;
  }
  },
  rules: [/^(?:[/][*]([*][^/]|[^*])*[*][/])/,/^(?:(\/\/|#|%|--)[^\n]*)/,/^(?:\s+)/,/^(?:<)/,/^(?:\{)/,/^(?:\[)/,/^(?:\()/,/^(?:>)/,/^(?:\})/,/^(?:\])/,/^(?:\))/,/^(?:=)/,/^(?:\.)/,/^(?:,)/,/^(?:;)/,/^(?::)/,/^(?:\$)/,/^(?:\|)/,/^(?:\^)/,/^(?:"([^"\\]|\\(.|\n))*"|'([^'\\]|\\(.|\n))*')/,/^(?:[a-zA-Z_][a-zA-Z0-9_?!]*)/,/^(?:0|[-]?[1-9][0-9]*)/,/^(?:$)/],
  conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],"inclusive":true}}
  });
  return lexer;
  })();
  parser.lexer = lexer;
  function Parser () {
    this.yy = {};
  }
  Parser.prototype = parser;parser.Parser = Parser;
  return new Parser;
  })();
  parser.Parser;
  const ___parse = parser.parse.bind(parser);

  const baseToShifted = {
      '0': 'A', '1': 'B', '2': 'C', '3': 'D',
      '4': 'E', '5': 'F', '6': 'G', '7': 'H',
      '8': 'I', '9': 'J', 'a': 'K', 'b': 'L',
      'c': 'M', 'd': 'N', 'e': 'O', 'f': 'P',
      'g': 'Q', 'h': 'R', 'i': 'S', 'j': 'T',
      'k': 'U', 'l': 'V', 'm': 'W', 'n': 'X',
      'o': 'Y', 'p': 'Z', 'q': 'q', 'r': 'r',
      's': 's', 't': 't', 'u': 'u', 'v': 'v',
      'w': 'w', 'x': 'x', 'y': 'y', 'z': 'z'
  };

  const base = Object.keys(baseToShifted).length;

  function shifString(baseString) {
      let shiftedString = '';
      for (let i = 0; i < baseString.length; i++) {
          shiftedString += baseToShifted[baseString[i]];
      }
      return shiftedString;
  }


  function hash(inputString) {
      if (inputString.match(/^\$C0=.*;$/))
          inputString = inputString.slice(4,-1);
      let hashValue = 0;
      const prime = 31;
      const mod = 9007199254740881;

      for (let i = 0; i < inputString.length; i++) {
          let charCode = inputString.charCodeAt(i);
          hashValue = (hashValue * prime + charCode) % mod;
      }

      return shifString(hashValue.toString(base));
  }

  const unitCode = hash('$C0={};'); // it was '{}'

  function patterns(codes, representatives, rels) {
    // INPUT: 
    //   codes: {"BG": {"code": "product", "product": {}}, ...}
    //   representatives:{"{}": "BG", ...}
    //   rels: {"rlz": [{op: comp,...}, ...], ...}
    
    // OUTPUT: returns pattern graph: 
    //  { patternNodes: [{code,type,closed},...], 
    //    patternEdges: {src: {label: dst, ...}}...} 
    // as well as it will annotate rels; each rel node will have property "patterns: [i, o]"

    const patternNodes = []; // e.g.: [{ code: null, type: null, closed" false}], 
    const patternEdges = {}; // e.g.: {0: {label: 2}, ...}, 

    // 1 INITIALIZATION
    // 1.1 initialize patternNodes and rels

    function augment(rel) {
      const i = patternNodes.length;
      const pattern_i = { _id: i, code: null, type: null, closed: false};
      patternNodes.push(pattern_i); 
      switch (rel.op) {
        case "product":
          rel["product"].forEach(({label, exp}) => augment(exp));
          break;
        case "union":
        case "comp":
        case "vector":
          rel[rel.op].forEach((exp) => augment(exp));
        case "code":
          rel["code"] = representatives[rel.code] || rel.code;
      }

      const o = patternNodes.length;
      const pattern_o = { _id: o, code: null, type: null, closed: false};
      patternNodes.push(pattern_o);
      rel.patterns = [i, o];
    }

    for (const relName in rels) {
      const defs = rels[relName];
      for (const def of defs) { augment(def); }
    }

    // console.log(JSON.stringify(rels,"",2));

    // 1.2 initialize 'eq' (equivalence classes over patternNodes) and 'patternEdges'
    
    const eq = patternNodes.map((_, i) => i); // equivalence classes over patternNodes, e.g., [0, 1, 0, ...]}
    
    function getRep(i) {
      while (eq[i] !== i) { i = eq[i]; }
      return i;
    }
     
    for (const node_id in eq) { patternEdges[node_id]={}; }
    
    // -------- helper functions -------- 

    function inspect(rel) {
      const op = rel.op;
      // console.log(`Inspecting ${op} ${JSON.stringify(rel)}`);
      try {
        switch (op) {
          case "product":
            return inspectProduct(rel);
          case "union":
            return inspectUnion(rel);
          case "comp": 
            return inspectComp(rel);
          case "identity":
            return inspectIdentity(rel);
          case "vector":
            return inspectVector(rel);
          case "dot":
            return inspectDot(rel);
          case "code": 
            return inspectCode(rel);
          case "ref":
            return inspectRef(rel);
          case "int":
            return inspectInt(rel);
          case "str":
            return inspectStr(rel);

        }
        throw new Error(`Unknown op: ${op}`);
      } catch (e) {
        console.error(`Code Derivation Error for '${op}' (lines ${rel.start.line}:${rel.start.column}...${rel.end.line}:${rel.end.column}): ${e.message}.`);
        throw e;
      }   
    }
    
    function updatePattern(pattern, {code, type, closed}) {
      if (code) {
        type = "code";
        closed = true;
        if (pattern.code == code && pattern.type == type && pattern.closed == closed) { 
          return false; 
        }
        if (pattern.code) {
          throw new Error(`Cannot update pattern with code: ${pattern.code} -> ${code}`);
        }
        if (pattern.type && pattern.type != codes[code].code) {
          throw new Error(`Cannot update pattern with code '${code}': pattern type: ${pattern.type} -> code type: ${codes[code].code}`);
        }
        pattern.code = code; 
        pattern.closed = true;
        pattern.type = "code";
        return true;
      }
    
      if (pattern.code) {
        // TODO: check for potential type mismatch between 'type' and 'code.code' 
        return false; 
      }

      let changed = false;
    
      if (type) {
        if (! pattern.type) {
          pattern.type = type;
          changed = true;
        } else if (pattern.type != type) {
          throw new Error(`Cannot update pattern ${JSON.stringify(pattern)} with ${JSON.stringify({code, type, closed})}`);
        }
      }

      if (closed && (! pattern.closed)) {
        pattern.closed = closed;
        return true; 
      }
        
      return changed;    
    }
    
    function join(i, j) {
      const iRep = getRep(i);
      const jRep = getRep(j);
      if (iRep == jRep) { return false; } 
      // create new representative
      const iPattern = patternNodes[iRep];
      const jPattern = patternNodes[jRep];

      const newRep = patternNodes.length;
      const newPattern = { 
        _id: newRep, 
        code: null, type: null, closed: false, 
        _from: `(${iPattern._from || iRep},${jPattern._from || jRep})`};
      patternNodes[newRep] = newPattern;
      patternEdges[newRep] = {};
      eq[iRep] = eq[jRep] = eq[newRep] = newRep;   
      // we still have to merge patterns and migrate edges
      updatePattern(newPattern, iPattern);
      updatePattern(newPattern, jPattern);
      migrateEdges(jRep, newRep);
      migrateEdges(iRep, newRep);
      
      return newRep;  
    }
    
    function migrateEdges(from_i, to_j) {
      const iEdges = patternEdges[from_i];
      const jEdges = patternEdges[to_j];
      for (const label in iEdges) {
        const iTarget = iEdges[label];
        const jTarget = jEdges[label];
        if (jTarget) {
          const newTarget = join(iTarget, jTarget);
          if (newTarget) {
            jEdges[label] = newTarget;
          }
        } else {
          jEdges[label] = iTarget;
        }
      }
    }
    
    function addEdge(src, label, target) {
      // console.log("addEdge", src, label, target, "old target", patternEdges[src][label] || "none");
      const srcPattern = patternNodes[getRep(src)];
      if (srcPattern.type == "code") {
        const code = codes[representatives[srcPattern.code] || srcPattern.code];
        if (code.code == "product" || code.code == "union" ) {
          return updatePattern(patternNodes[getRep(target)], {code: code[code.code][label]})
        }  
        throw new Error(`Cannot add edge ${label} to code ${JSON.stringify(code)}`);
      }
      if (srcPattern.type == 'vector') {
        if (/^(0|[1-9][0-9]*)$/.test(label)) {
          const old_target = patternEdges[src]['vector-member'];
          if (old_target) {
            const newTarget = join(old_target, target);
            if (newTarget) {
              patternEdges[src][label] = newTarget;
              return true;
            }
            return false;
          }
          patternEdges[src]['vector-member'] = target;
          return true;
        }
        throw new Error(`Cannot add edge ${label} to code ${JSON.stringify(code)}`);
      }
      const old_target = patternEdges[src][label];
      if (old_target) {
        const newTarget = join(old_target, target);
        if (newTarget) {
          patternEdges[src][label] = newTarget;
          return true;
        }
        return false;
      }
      
      if (srcPattern.closed) {
        throw new Error(`Cannot add edge ${label} to pattern ${JSON.stringify(srcPattern)}`);
      }
      patternEdges[src][label] = target;
      return true;
    }

    function inspectInt(rel) {
      const o_pattern = patternNodes[rel.patterns[1]];
      return updatePattern(o_pattern, {code: "int", type: "code", closed: true});
    }
    
    function inspectStr(rel) {
      const o_pattern = patternNodes[rel.patterns[1]];
      return updatePattern(o_pattern, {code: "string", type: "code", closed: true});
    }

    function inspectDot(rel) {
      const old_i = getRep(rel.patterns[0]);
      const old_o = getRep(rel.patterns[1]);
      const old_i_pattern = patternNodes[old_i];
      const old_o_pattern = patternNodes[old_o];
      const field = rel.dot;
      if (old_i_pattern.type == "code") {
        if (old_i_pattern.code == "int" || old_i_pattern.code == "bool" || old_i_pattern.code == "string") {
          return updatePattern(old_o_pattern, {code: "product", type: "code", closed: true, product: []});
        }
        const code = codes[representatives[old_i_pattern.code] || old_i_pattern.code];
        if (code.code == "product" || code.code == "union" || code.code == "vector") {
          const target_code = code[code.code][field];
          if (target_code) 
            return updatePattern(old_o_pattern, {code: target_code});
        }
        throw new Error(`Cannot find field ${field} in code ${JSON.stringify(code)}`); 
      }

      return addEdge(old_i, field, old_o);
    }
    
    function inspectProduct(rel) {
      switch (rel.product.length) {
        case 0: {
          // unit
          const old_o = getRep(rel.patterns[1]);
          const old_o_pattern = patternNodes[old_o];
          // check that there is no patternEdge from old_o
          for (const label in patternEdges[old_o]) {
            throw new Error(`Label ${label} in code '{}'.`);
          }
          return updatePattern(old_o_pattern, {code: unitCode, type: "code", closed: true});
        }
        case 1: {
          // union constructor:  %old_i { %exp_i exp %exp_o field } %old_o 
          const field = rel.product[0].label;
          const exp = rel.product[0].exp;
          var modified = inspect(exp);
    
          const old_i = getRep(rel.patterns[0]);
          const old_o = getRep(rel.patterns[1]);
          const old_o_pattern = patternNodes[old_o];
          
          const exp_i = getRep(exp.patterns[0]);
          const exp_o = getRep(exp.patterns[1]);
          
          var modified = join(exp_i, old_i);
    
          modified = updatePattern(old_o_pattern, {code: null, type: "union", closed: false}) || modified;
          modified = addEdge(old_o, field, exp_o) || modified;
    
          return modified;
        }
      }
      // product constructor %old_i { %exp0_i exp0 %exp0_o field0, ... %expk_i expk %expk_o fieldk } %old_o
      var modified = rel.product.reduce((modified, {label,exp}) => 
        inspect(exp) || modified, false);
    
      const fields = rel.product.map(({label, exp}) => 
        ({label, exp_i: getRep(exp.patterns[0]), exp_o: getRep(exp.patterns[1])}));
    
      const old_i = getRep(rel.patterns[0]);
      const old_o = getRep(rel.patterns[1]);
      const old_o_pattern = patternNodes[old_o];
      
      for (const {label, exp_i, exp_o} of fields) {
        modified = join(exp_i, old_i) || modified;
        modified = addEdge(old_o, label, exp_o) || modified;
      }
      modified = updatePattern(old_o_pattern, {type: "product", closed: true}) || modified;
      // check that patternEdges coincide with field labels
      const patternEdgeLabels = Object.keys(patternEdges[old_o]);
      const labels = fields.reduce( (labels,{label}) => 
        ({[label]: true, ...labels}), {});
     
      for (const label of patternEdgeLabels) {
        if (!labels[label]) {
          throw new Error(`Label '${label}' not allowed for pattern ${JSON.stringify({...old_o_pattern, fields})}`);
        }
      }
      return modified;
    }
    
    function inspectUnion(rel) {
    
      const old_o = getRep(rel.patterns[1]);
      if (rel.union.length == 0) {
        return updatePattern(patternNodes[old_o], {type: "union", closed: true}); 
      }
      // union: %old_i < %exp0_i exp0 %exp0_o, ... %expk_i expk %expk_o > %old_o
      
      const modified = rel.union.reduce((modified, exp) => {
        var new_modified = inspect(exp) || modified;
        new_modified = join(rel.patterns[0], exp.patterns[0]) || modified;
        new_modified = join(rel.patterns[1], exp.patterns[1]) || modified;
        return new_modified;
      }, false);
      return modified;
    }

    function inspectComp(rel) {
      if (rel.comp.length == 0) { return inspectIdentity(rel); }

      // comp: %old_i ( %exp0_i exp0 %exp0_o, ... %expk_i expk %expk_o ) %old_o
      const old_i = getRep(rel.patterns[0]);
      const [modified,pattern_o] = rel.comp.reduce(([modified,pattern_i], exp) => {
        var new_modified = inspect(exp) || modified;
        new_modified = join(pattern_i, exp.patterns[0]) || modified;
        return [new_modified, exp.patterns[1]];
      }, [false, old_i]);
      return join(pattern_o, rel.patterns[1]) || modified;
    }
    
    function inspectIdentity(rel) { 
      return join(rel.patterns[0], rel.patterns[1]);
    }
    
    function inspectVector(rel) { 
      const old_o = getRep(rel.patterns[1]);
      var modified = updatePattern(patternNodes[old_o], {type: "vector", closed: true});
      if (rel.vector.length == 0) {
        return modified; 
      }
      // vector: %old_i [ %exp0_i exp0 %exp0_o, ... %expk_i expk %expk_o] %old_o
      
      let member_o = patternEdges[old_o]["vector-member"];
      if (member_o) { 
        member_o =  getRep(patternEdges[old_o]["vector-member"]);
      } else {
        modified = true;
        member_o = patternNodes.length;
        patternNodes.push({ _id: member_o, code: null, type: null, closed: false});
        patternEdges[old_o]["vector-member"] = member_o;
        eq[member_o] = member_o;
      }

      modified = rel.vector.reduce((modified, exp) => {
        modified = inspect(exp) || modified;
        modified = join(rel.patterns[0], exp.patterns[0]) || modified;
        modified = join(member_o, exp.patterns[1]) || modified;
        return modified;
      }, modified);
      return modified;
    }
    
    function inspectCode(rel) {
      const old_i = getRep(rel.patterns[0]);
      var modified = updatePattern(patternNodes[old_i], {code: representatives[rel.code] || rel.code});
      return join(old_i, rel.patterns[1]) || modified;
    }
    
    function inspectRef(rel) { 
      const relDefs = rels[rel.ref];
      // For now we assume only the first def which does not throw!!!!
      // That's good enough if all defs are typed by different input codes.
      if (!relDefs) {
        switch (rel.ref) {
          case "true": 
          case "false": return updatePattern(patternNodes[rel.patterns[1]], {code: "bool"});

          case "PLUS":
          case "TIMES": 
            // should add updating the input parrent to code `$[int]`
            // console.log("PLUS/TIMES", rel);
            return updatePattern(patternNodes[rel.patterns[1]], {code: "int"});
          case "CONCAT":
            return updatePattern(patternNodes[rel.patterns[1]], {code: "string"});
          case "toDateMsec":
            return updatePattern(patternNodes[rel.patterns[1]], {code: "int"});
          case "toJSON":
            return updatePattern(patternNodes[rel.patterns[1]], {code: "string"});
          case "toDateStr":
            return updatePattern(patternNodes[rel.patterns[1]], {code: "string"});

          // TO DO
          case "GT":
          case "EQ":
          case "null":
          case "DIV":
          case "FDIV":
          case "fromJSON":
          case "CONS":
          case "SNOC":
            return false;
        }
        throw new Error(`No definition found for ${rel.ref}`);  
      }
      for (const def of relDefs) {
        try {
          var modified = join(def.patterns[0], rel.patterns[0]);
          modified = join(def.patterns[1], rel.patterns[1]) || modified;
          return modified;
        } catch (e) {}
      } 
      throw new Error(`No matching definition found for ${rel.ref}`);  
    }


    // --------- main loop --------------

    // 2. loop until no more changes

    let changed = true;
    while (changed) { 
      changed = false;
      for (const relName in rels) {
        const defs = rels[relName];
        for (const def of defs) {
          changed = inspect(def) || changed;
        }
      }
    }

    // 3. compress the pattern graph

    // 3.1. get representative nodes for each pattern
    // pNode = {repFromPatternNodes: 0, repFromPatternNodes: 1, ...}
    const pNodes = {};
    eq.map(getRep).forEach((p) => {
      pNodes[p] = p;
    });
    Object.keys(pNodes).map((p,i) => pNodes[p] = i);

    function updatePatterns(rel) {
      rel.patterns[0] = pNodes[getRep(rel.patterns[0])];
      rel.patterns[1] = pNodes[getRep(rel.patterns[1])];
      switch (rel.op) {
        case "product":
          rel["product"].forEach(({label, exp}) => updatePatterns(exp));
          break;
        case "union":
        case "comp":
        case "vector":
          rel[rel.op].forEach((exp) => updatePatterns(exp));
      }
    }

    for (const relName in rels) {
      const defs = rels[relName];
      for (const def of defs) { updatePatterns(def); }
    }

    const newPatternNodes = [];
    for (const i in pNodes) {
      newPatternNodes[pNodes[i]] = patternNodes[i];
    }
    const newPatternEdges = Object.keys(patternEdges).reduce(function (newPatternEdges, src) {
      const newSrc = pNodes[src];
      if (newSrc != undefined) { 
        newPatternEdges[newSrc] = Object.keys(patternEdges[src]).reduce(function (newPatternEdges, label) {
          newPatternEdges[label] = pNodes[getRep(patternEdges[src][label])];
          return newPatternEdges;
        }, {});
      }
      return newPatternEdges;
    }, {});

    // loops in the pattern graph are forcing the pattern to be union!

    for( const i in newPatternNodes) {
      const node = newPatternNodes[i];
      for (const label in newPatternEdges[i]) {
        if (newPatternEdges[i][label] == i) {
          if (node.type == "product") {
            throw new Error("Loop in product code!");
          }
          node.type = "union";
        }
      }
    }

    return { patternNodes: newPatternNodes, patternEdges: newPatternEdges };  
  }

  var global$1 = (typeof global !== "undefined" ? global :
    typeof self !== "undefined" ? self :
    typeof window !== "undefined" ? window : {});

  var lookup = [];
  var revLookup = [];
  var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
  var inited = false;
  function init () {
    inited = true;
    var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    for (var i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }

    revLookup['-'.charCodeAt(0)] = 62;
    revLookup['_'.charCodeAt(0)] = 63;
  }

  function toByteArray (b64) {
    if (!inited) {
      init();
    }
    var i, j, l, tmp, placeHolders, arr;
    var len = b64.length;

    if (len % 4 > 0) {
      throw new Error('Invalid string. Length must be a multiple of 4')
    }

    // the number of equal signs (place holders)
    // if there are two placeholders, than the two characters before it
    // represent one byte
    // if there is only one, then the three characters before it represent 2 bytes
    // this is just a cheap hack to not do indexOf twice
    placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

    // base64 is 4/3 + up to two characters of the original data
    arr = new Arr(len * 3 / 4 - placeHolders);

    // if there are placeholders, only get up to the last complete 4 chars
    l = placeHolders > 0 ? len - 4 : len;

    var L = 0;

    for (i = 0, j = 0; i < l; i += 4, j += 3) {
      tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
      arr[L++] = (tmp >> 16) & 0xFF;
      arr[L++] = (tmp >> 8) & 0xFF;
      arr[L++] = tmp & 0xFF;
    }

    if (placeHolders === 2) {
      tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
      arr[L++] = tmp & 0xFF;
    } else if (placeHolders === 1) {
      tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
      arr[L++] = (tmp >> 8) & 0xFF;
      arr[L++] = tmp & 0xFF;
    }

    return arr
  }

  function tripletToBase64 (num) {
    return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
  }

  function encodeChunk (uint8, start, end) {
    var tmp;
    var output = [];
    for (var i = start; i < end; i += 3) {
      tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
      output.push(tripletToBase64(tmp));
    }
    return output.join('')
  }

  function fromByteArray (uint8) {
    if (!inited) {
      init();
    }
    var tmp;
    var len = uint8.length;
    var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
    var output = '';
    var parts = [];
    var maxChunkLength = 16383; // must be multiple of 3

    // go through the array every three bytes, we'll deal with trailing stuff later
    for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
      parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
    }

    // pad the end with zeros, but make sure to not forget the extra bytes
    if (extraBytes === 1) {
      tmp = uint8[len - 1];
      output += lookup[tmp >> 2];
      output += lookup[(tmp << 4) & 0x3F];
      output += '==';
    } else if (extraBytes === 2) {
      tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
      output += lookup[tmp >> 10];
      output += lookup[(tmp >> 4) & 0x3F];
      output += lookup[(tmp << 2) & 0x3F];
      output += '=';
    }

    parts.push(output);

    return parts.join('')
  }

  function read (buffer, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE ? (nBytes - 1) : 0;
    var d = isLE ? -1 : 1;
    var s = buffer[offset + i];

    i += d;

    e = s & ((1 << (-nBits)) - 1);
    s >>= (-nBits);
    nBits += eLen;
    for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

    m = e & ((1 << (-nBits)) - 1);
    e >>= (-nBits);
    nBits += mLen;
    for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

    if (e === 0) {
      e = 1 - eBias;
    } else if (e === eMax) {
      return m ? NaN : ((s ? -1 : 1) * Infinity)
    } else {
      m = m + Math.pow(2, mLen);
      e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
  }

  function write (buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
    var i = isLE ? 0 : (nBytes - 1);
    var d = isLE ? 1 : -1;
    var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

    value = Math.abs(value);

    if (isNaN(value) || value === Infinity) {
      m = isNaN(value) ? 1 : 0;
      e = eMax;
    } else {
      e = Math.floor(Math.log(value) / Math.LN2);
      if (value * (c = Math.pow(2, -e)) < 1) {
        e--;
        c *= 2;
      }
      if (e + eBias >= 1) {
        value += rt / c;
      } else {
        value += rt * Math.pow(2, 1 - eBias);
      }
      if (value * c >= 2) {
        e++;
        c /= 2;
      }

      if (e + eBias >= eMax) {
        m = 0;
        e = eMax;
      } else if (e + eBias >= 1) {
        m = (value * c - 1) * Math.pow(2, mLen);
        e = e + eBias;
      } else {
        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
        e = 0;
      }
    }

    for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

    e = (e << mLen) | m;
    eLen += mLen;
    for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

    buffer[offset + i - d] |= s * 128;
  }

  var toString = {}.toString;

  var isArray$1 = Array.isArray || function (arr) {
    return toString.call(arr) == '[object Array]';
  };

  /*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
   * @license  MIT
   */
  /* eslint-disable no-proto */


  var INSPECT_MAX_BYTES = 50;

  /**
   * If `Buffer.TYPED_ARRAY_SUPPORT`:
   *   === true    Use Uint8Array implementation (fastest)
   *   === false   Use Object implementation (most compatible, even IE6)
   *
   * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
   * Opera 11.6+, iOS 4.2+.
   *
   * Due to various browser bugs, sometimes the Object implementation will be used even
   * when the browser supports typed arrays.
   *
   * Note:
   *
   *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
   *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
   *
   *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
   *
   *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
   *     incorrect length in some situations.

   * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
   * get the Object implementation, which is slower but behaves correctly.
   */
  Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
    ? global$1.TYPED_ARRAY_SUPPORT
    : true;

  /*
   * Export kMaxLength after typed array support is determined.
   */
  kMaxLength();

  function kMaxLength () {
    return Buffer.TYPED_ARRAY_SUPPORT
      ? 0x7fffffff
      : 0x3fffffff
  }

  function createBuffer (that, length) {
    if (kMaxLength() < length) {
      throw new RangeError('Invalid typed array length')
    }
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      // Return an augmented `Uint8Array` instance, for best performance
      that = new Uint8Array(length);
      that.__proto__ = Buffer.prototype;
    } else {
      // Fallback: Return an object instance of the Buffer class
      if (that === null) {
        that = new Buffer(length);
      }
      that.length = length;
    }

    return that
  }

  /**
   * The Buffer constructor returns instances of `Uint8Array` that have their
   * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
   * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
   * and the `Uint8Array` methods. Square bracket notation works as expected -- it
   * returns a single octet.
   *
   * The `Uint8Array` prototype remains unmodified.
   */

  function Buffer (arg, encodingOrOffset, length) {
    if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
      return new Buffer(arg, encodingOrOffset, length)
    }

    // Common case.
    if (typeof arg === 'number') {
      if (typeof encodingOrOffset === 'string') {
        throw new Error(
          'If encoding is specified then the first argument must be a string'
        )
      }
      return allocUnsafe(this, arg)
    }
    return from(this, arg, encodingOrOffset, length)
  }

  Buffer.poolSize = 8192; // not used by this implementation

  // TODO: Legacy, not needed anymore. Remove in next major version.
  Buffer._augment = function (arr) {
    arr.__proto__ = Buffer.prototype;
    return arr
  };

  function from (that, value, encodingOrOffset, length) {
    if (typeof value === 'number') {
      throw new TypeError('"value" argument must not be a number')
    }

    if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
      return fromArrayBuffer(that, value, encodingOrOffset, length)
    }

    if (typeof value === 'string') {
      return fromString(that, value, encodingOrOffset)
    }

    return fromObject(that, value)
  }

  /**
   * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
   * if value is a number.
   * Buffer.from(str[, encoding])
   * Buffer.from(array)
   * Buffer.from(buffer)
   * Buffer.from(arrayBuffer[, byteOffset[, length]])
   **/
  Buffer.from = function (value, encodingOrOffset, length) {
    return from(null, value, encodingOrOffset, length)
  };

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    Buffer.prototype.__proto__ = Uint8Array.prototype;
    Buffer.__proto__ = Uint8Array;
    if (typeof Symbol !== 'undefined' && Symbol.species &&
        Buffer[Symbol.species] === Buffer) ;
  }

  function assertSize (size) {
    if (typeof size !== 'number') {
      throw new TypeError('"size" argument must be a number')
    } else if (size < 0) {
      throw new RangeError('"size" argument must not be negative')
    }
  }

  function alloc (that, size, fill, encoding) {
    assertSize(size);
    if (size <= 0) {
      return createBuffer(that, size)
    }
    if (fill !== undefined) {
      // Only pay attention to encoding if it's a string. This
      // prevents accidentally sending in a number that would
      // be interpretted as a start offset.
      return typeof encoding === 'string'
        ? createBuffer(that, size).fill(fill, encoding)
        : createBuffer(that, size).fill(fill)
    }
    return createBuffer(that, size)
  }

  /**
   * Creates a new filled Buffer instance.
   * alloc(size[, fill[, encoding]])
   **/
  Buffer.alloc = function (size, fill, encoding) {
    return alloc(null, size, fill, encoding)
  };

  function allocUnsafe (that, size) {
    assertSize(size);
    that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
    if (!Buffer.TYPED_ARRAY_SUPPORT) {
      for (var i = 0; i < size; ++i) {
        that[i] = 0;
      }
    }
    return that
  }

  /**
   * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
   * */
  Buffer.allocUnsafe = function (size) {
    return allocUnsafe(null, size)
  };
  /**
   * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
   */
  Buffer.allocUnsafeSlow = function (size) {
    return allocUnsafe(null, size)
  };

  function fromString (that, string, encoding) {
    if (typeof encoding !== 'string' || encoding === '') {
      encoding = 'utf8';
    }

    if (!Buffer.isEncoding(encoding)) {
      throw new TypeError('"encoding" must be a valid string encoding')
    }

    var length = byteLength(string, encoding) | 0;
    that = createBuffer(that, length);

    var actual = that.write(string, encoding);

    if (actual !== length) {
      // Writing a hex string, for example, that contains invalid characters will
      // cause everything after the first invalid character to be ignored. (e.g.
      // 'abxxcd' will be treated as 'ab')
      that = that.slice(0, actual);
    }

    return that
  }

  function fromArrayLike (that, array) {
    var length = array.length < 0 ? 0 : checked(array.length) | 0;
    that = createBuffer(that, length);
    for (var i = 0; i < length; i += 1) {
      that[i] = array[i] & 255;
    }
    return that
  }

  function fromArrayBuffer (that, array, byteOffset, length) {
    array.byteLength; // this throws if `array` is not a valid ArrayBuffer

    if (byteOffset < 0 || array.byteLength < byteOffset) {
      throw new RangeError('\'offset\' is out of bounds')
    }

    if (array.byteLength < byteOffset + (length || 0)) {
      throw new RangeError('\'length\' is out of bounds')
    }

    if (byteOffset === undefined && length === undefined) {
      array = new Uint8Array(array);
    } else if (length === undefined) {
      array = new Uint8Array(array, byteOffset);
    } else {
      array = new Uint8Array(array, byteOffset, length);
    }

    if (Buffer.TYPED_ARRAY_SUPPORT) {
      // Return an augmented `Uint8Array` instance, for best performance
      that = array;
      that.__proto__ = Buffer.prototype;
    } else {
      // Fallback: Return an object instance of the Buffer class
      that = fromArrayLike(that, array);
    }
    return that
  }

  function fromObject (that, obj) {
    if (internalIsBuffer(obj)) {
      var len = checked(obj.length) | 0;
      that = createBuffer(that, len);

      if (that.length === 0) {
        return that
      }

      obj.copy(that, 0, 0, len);
      return that
    }

    if (obj) {
      if ((typeof ArrayBuffer !== 'undefined' &&
          obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
        if (typeof obj.length !== 'number' || isnan(obj.length)) {
          return createBuffer(that, 0)
        }
        return fromArrayLike(that, obj)
      }

      if (obj.type === 'Buffer' && isArray$1(obj.data)) {
        return fromArrayLike(that, obj.data)
      }
    }

    throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
  }

  function checked (length) {
    // Note: cannot use `length < kMaxLength()` here because that fails when
    // length is NaN (which is otherwise coerced to zero.)
    if (length >= kMaxLength()) {
      throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                           'size: 0x' + kMaxLength().toString(16) + ' bytes')
    }
    return length | 0
  }
  Buffer.isBuffer = isBuffer;
  function internalIsBuffer (b) {
    return !!(b != null && b._isBuffer)
  }

  Buffer.compare = function compare (a, b) {
    if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
      throw new TypeError('Arguments must be Buffers')
    }

    if (a === b) return 0

    var x = a.length;
    var y = b.length;

    for (var i = 0, len = Math.min(x, y); i < len; ++i) {
      if (a[i] !== b[i]) {
        x = a[i];
        y = b[i];
        break
      }
    }

    if (x < y) return -1
    if (y < x) return 1
    return 0
  };

  Buffer.isEncoding = function isEncoding (encoding) {
    switch (String(encoding).toLowerCase()) {
      case 'hex':
      case 'utf8':
      case 'utf-8':
      case 'ascii':
      case 'latin1':
      case 'binary':
      case 'base64':
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return true
      default:
        return false
    }
  };

  Buffer.concat = function concat (list, length) {
    if (!isArray$1(list)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }

    if (list.length === 0) {
      return Buffer.alloc(0)
    }

    var i;
    if (length === undefined) {
      length = 0;
      for (i = 0; i < list.length; ++i) {
        length += list[i].length;
      }
    }

    var buffer = Buffer.allocUnsafe(length);
    var pos = 0;
    for (i = 0; i < list.length; ++i) {
      var buf = list[i];
      if (!internalIsBuffer(buf)) {
        throw new TypeError('"list" argument must be an Array of Buffers')
      }
      buf.copy(buffer, pos);
      pos += buf.length;
    }
    return buffer
  };

  function byteLength (string, encoding) {
    if (internalIsBuffer(string)) {
      return string.length
    }
    if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
        (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
      return string.byteLength
    }
    if (typeof string !== 'string') {
      string = '' + string;
    }

    var len = string.length;
    if (len === 0) return 0

    // Use a for loop to avoid recursion
    var loweredCase = false;
    for (;;) {
      switch (encoding) {
        case 'ascii':
        case 'latin1':
        case 'binary':
          return len
        case 'utf8':
        case 'utf-8':
        case undefined:
          return utf8ToBytes(string).length
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return len * 2
        case 'hex':
          return len >>> 1
        case 'base64':
          return base64ToBytes(string).length
        default:
          if (loweredCase) return utf8ToBytes(string).length // assume utf8
          encoding = ('' + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  }
  Buffer.byteLength = byteLength;

  function slowToString (encoding, start, end) {
    var loweredCase = false;

    // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
    // property of a typed array.

    // This behaves neither like String nor Uint8Array in that we set start/end
    // to their upper/lower bounds if the value passed is out of range.
    // undefined is handled specially as per ECMA-262 6th Edition,
    // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
    if (start === undefined || start < 0) {
      start = 0;
    }
    // Return early if start > this.length. Done here to prevent potential uint32
    // coercion fail below.
    if (start > this.length) {
      return ''
    }

    if (end === undefined || end > this.length) {
      end = this.length;
    }

    if (end <= 0) {
      return ''
    }

    // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
    end >>>= 0;
    start >>>= 0;

    if (end <= start) {
      return ''
    }

    if (!encoding) encoding = 'utf8';

    while (true) {
      switch (encoding) {
        case 'hex':
          return hexSlice(this, start, end)

        case 'utf8':
        case 'utf-8':
          return utf8Slice(this, start, end)

        case 'ascii':
          return asciiSlice(this, start, end)

        case 'latin1':
        case 'binary':
          return latin1Slice(this, start, end)

        case 'base64':
          return base64Slice(this, start, end)

        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return utf16leSlice(this, start, end)

        default:
          if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
          encoding = (encoding + '').toLowerCase();
          loweredCase = true;
      }
    }
  }

  // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
  // Buffer instances.
  Buffer.prototype._isBuffer = true;

  function swap (b, n, m) {
    var i = b[n];
    b[n] = b[m];
    b[m] = i;
  }

  Buffer.prototype.swap16 = function swap16 () {
    var len = this.length;
    if (len % 2 !== 0) {
      throw new RangeError('Buffer size must be a multiple of 16-bits')
    }
    for (var i = 0; i < len; i += 2) {
      swap(this, i, i + 1);
    }
    return this
  };

  Buffer.prototype.swap32 = function swap32 () {
    var len = this.length;
    if (len % 4 !== 0) {
      throw new RangeError('Buffer size must be a multiple of 32-bits')
    }
    for (var i = 0; i < len; i += 4) {
      swap(this, i, i + 3);
      swap(this, i + 1, i + 2);
    }
    return this
  };

  Buffer.prototype.swap64 = function swap64 () {
    var len = this.length;
    if (len % 8 !== 0) {
      throw new RangeError('Buffer size must be a multiple of 64-bits')
    }
    for (var i = 0; i < len; i += 8) {
      swap(this, i, i + 7);
      swap(this, i + 1, i + 6);
      swap(this, i + 2, i + 5);
      swap(this, i + 3, i + 4);
    }
    return this
  };

  Buffer.prototype.toString = function toString () {
    var length = this.length | 0;
    if (length === 0) return ''
    if (arguments.length === 0) return utf8Slice(this, 0, length)
    return slowToString.apply(this, arguments)
  };

  Buffer.prototype.equals = function equals (b) {
    if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
    if (this === b) return true
    return Buffer.compare(this, b) === 0
  };

  Buffer.prototype.inspect = function inspect () {
    var str = '';
    var max = INSPECT_MAX_BYTES;
    if (this.length > 0) {
      str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
      if (this.length > max) str += ' ... ';
    }
    return '<Buffer ' + str + '>'
  };

  Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
    if (!internalIsBuffer(target)) {
      throw new TypeError('Argument must be a Buffer')
    }

    if (start === undefined) {
      start = 0;
    }
    if (end === undefined) {
      end = target ? target.length : 0;
    }
    if (thisStart === undefined) {
      thisStart = 0;
    }
    if (thisEnd === undefined) {
      thisEnd = this.length;
    }

    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
      throw new RangeError('out of range index')
    }

    if (thisStart >= thisEnd && start >= end) {
      return 0
    }
    if (thisStart >= thisEnd) {
      return -1
    }
    if (start >= end) {
      return 1
    }

    start >>>= 0;
    end >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;

    if (this === target) return 0

    var x = thisEnd - thisStart;
    var y = end - start;
    var len = Math.min(x, y);

    var thisCopy = this.slice(thisStart, thisEnd);
    var targetCopy = target.slice(start, end);

    for (var i = 0; i < len; ++i) {
      if (thisCopy[i] !== targetCopy[i]) {
        x = thisCopy[i];
        y = targetCopy[i];
        break
      }
    }

    if (x < y) return -1
    if (y < x) return 1
    return 0
  };

  // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
  // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
  //
  // Arguments:
  // - buffer - a Buffer to search
  // - val - a string, Buffer, or number
  // - byteOffset - an index into `buffer`; will be clamped to an int32
  // - encoding - an optional encoding, relevant is val is a string
  // - dir - true for indexOf, false for lastIndexOf
  function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
    // Empty buffer means no match
    if (buffer.length === 0) return -1

    // Normalize byteOffset
    if (typeof byteOffset === 'string') {
      encoding = byteOffset;
      byteOffset = 0;
    } else if (byteOffset > 0x7fffffff) {
      byteOffset = 0x7fffffff;
    } else if (byteOffset < -0x80000000) {
      byteOffset = -0x80000000;
    }
    byteOffset = +byteOffset;  // Coerce to Number.
    if (isNaN(byteOffset)) {
      // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
      byteOffset = dir ? 0 : (buffer.length - 1);
    }

    // Normalize byteOffset: negative offsets start from the end of the buffer
    if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
    if (byteOffset >= buffer.length) {
      if (dir) return -1
      else byteOffset = buffer.length - 1;
    } else if (byteOffset < 0) {
      if (dir) byteOffset = 0;
      else return -1
    }

    // Normalize val
    if (typeof val === 'string') {
      val = Buffer.from(val, encoding);
    }

    // Finally, search either indexOf (if dir is true) or lastIndexOf
    if (internalIsBuffer(val)) {
      // Special case: looking for empty string/buffer always fails
      if (val.length === 0) {
        return -1
      }
      return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
    } else if (typeof val === 'number') {
      val = val & 0xFF; // Search for a byte value [0-255]
      if (Buffer.TYPED_ARRAY_SUPPORT &&
          typeof Uint8Array.prototype.indexOf === 'function') {
        if (dir) {
          return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
        } else {
          return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
        }
      }
      return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
    }

    throw new TypeError('val must be string, number or Buffer')
  }

  function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
    var indexSize = 1;
    var arrLength = arr.length;
    var valLength = val.length;

    if (encoding !== undefined) {
      encoding = String(encoding).toLowerCase();
      if (encoding === 'ucs2' || encoding === 'ucs-2' ||
          encoding === 'utf16le' || encoding === 'utf-16le') {
        if (arr.length < 2 || val.length < 2) {
          return -1
        }
        indexSize = 2;
        arrLength /= 2;
        valLength /= 2;
        byteOffset /= 2;
      }
    }

    function read (buf, i) {
      if (indexSize === 1) {
        return buf[i]
      } else {
        return buf.readUInt16BE(i * indexSize)
      }
    }

    var i;
    if (dir) {
      var foundIndex = -1;
      for (i = byteOffset; i < arrLength; i++) {
        if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
          if (foundIndex === -1) foundIndex = i;
          if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
        } else {
          if (foundIndex !== -1) i -= i - foundIndex;
          foundIndex = -1;
        }
      }
    } else {
      if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
      for (i = byteOffset; i >= 0; i--) {
        var found = true;
        for (var j = 0; j < valLength; j++) {
          if (read(arr, i + j) !== read(val, j)) {
            found = false;
            break
          }
        }
        if (found) return i
      }
    }

    return -1
  }

  Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1
  };

  Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
  };

  Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
  };

  function hexWrite (buf, string, offset, length) {
    offset = Number(offset) || 0;
    var remaining = buf.length - offset;
    if (!length) {
      length = remaining;
    } else {
      length = Number(length);
      if (length > remaining) {
        length = remaining;
      }
    }

    // must be an even number of digits
    var strLen = string.length;
    if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

    if (length > strLen / 2) {
      length = strLen / 2;
    }
    for (var i = 0; i < length; ++i) {
      var parsed = parseInt(string.substr(i * 2, 2), 16);
      if (isNaN(parsed)) return i
      buf[offset + i] = parsed;
    }
    return i
  }

  function utf8Write (buf, string, offset, length) {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
  }

  function asciiWrite (buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length)
  }

  function latin1Write (buf, string, offset, length) {
    return asciiWrite(buf, string, offset, length)
  }

  function base64Write (buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length)
  }

  function ucs2Write (buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
  }

  Buffer.prototype.write = function write (string, offset, length, encoding) {
    // Buffer#write(string)
    if (offset === undefined) {
      encoding = 'utf8';
      length = this.length;
      offset = 0;
    // Buffer#write(string, encoding)
    } else if (length === undefined && typeof offset === 'string') {
      encoding = offset;
      length = this.length;
      offset = 0;
    // Buffer#write(string, offset[, length][, encoding])
    } else if (isFinite(offset)) {
      offset = offset | 0;
      if (isFinite(length)) {
        length = length | 0;
        if (encoding === undefined) encoding = 'utf8';
      } else {
        encoding = length;
        length = undefined;
      }
    // legacy write(string, encoding, offset, length) - remove in v0.13
    } else {
      throw new Error(
        'Buffer.write(string, encoding, offset[, length]) is no longer supported'
      )
    }

    var remaining = this.length - offset;
    if (length === undefined || length > remaining) length = remaining;

    if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
      throw new RangeError('Attempt to write outside buffer bounds')
    }

    if (!encoding) encoding = 'utf8';

    var loweredCase = false;
    for (;;) {
      switch (encoding) {
        case 'hex':
          return hexWrite(this, string, offset, length)

        case 'utf8':
        case 'utf-8':
          return utf8Write(this, string, offset, length)

        case 'ascii':
          return asciiWrite(this, string, offset, length)

        case 'latin1':
        case 'binary':
          return latin1Write(this, string, offset, length)

        case 'base64':
          // Warning: maxLength not taken into account in base64Write
          return base64Write(this, string, offset, length)

        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return ucs2Write(this, string, offset, length)

        default:
          if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
          encoding = ('' + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  };

  Buffer.prototype.toJSON = function toJSON () {
    return {
      type: 'Buffer',
      data: Array.prototype.slice.call(this._arr || this, 0)
    }
  };

  function base64Slice (buf, start, end) {
    if (start === 0 && end === buf.length) {
      return fromByteArray(buf)
    } else {
      return fromByteArray(buf.slice(start, end))
    }
  }

  function utf8Slice (buf, start, end) {
    end = Math.min(buf.length, end);
    var res = [];

    var i = start;
    while (i < end) {
      var firstByte = buf[i];
      var codePoint = null;
      var bytesPerSequence = (firstByte > 0xEF) ? 4
        : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
        : 1;

      if (i + bytesPerSequence <= end) {
        var secondByte, thirdByte, fourthByte, tempCodePoint;

        switch (bytesPerSequence) {
          case 1:
            if (firstByte < 0x80) {
              codePoint = firstByte;
            }
            break
          case 2:
            secondByte = buf[i + 1];
            if ((secondByte & 0xC0) === 0x80) {
              tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
              if (tempCodePoint > 0x7F) {
                codePoint = tempCodePoint;
              }
            }
            break
          case 3:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
              tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
              if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                codePoint = tempCodePoint;
              }
            }
            break
          case 4:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            fourthByte = buf[i + 3];
            if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
              tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
              if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                codePoint = tempCodePoint;
              }
            }
        }
      }

      if (codePoint === null) {
        // we did not generate a valid codePoint so insert a
        // replacement char (U+FFFD) and advance only 1 byte
        codePoint = 0xFFFD;
        bytesPerSequence = 1;
      } else if (codePoint > 0xFFFF) {
        // encode to utf16 (surrogate pair dance)
        codePoint -= 0x10000;
        res.push(codePoint >>> 10 & 0x3FF | 0xD800);
        codePoint = 0xDC00 | codePoint & 0x3FF;
      }

      res.push(codePoint);
      i += bytesPerSequence;
    }

    return decodeCodePointsArray(res)
  }

  // Based on http://stackoverflow.com/a/22747272/680742, the browser with
  // the lowest limit is Chrome, with 0x10000 args.
  // We go 1 magnitude less, for safety
  var MAX_ARGUMENTS_LENGTH = 0x1000;

  function decodeCodePointsArray (codePoints) {
    var len = codePoints.length;
    if (len <= MAX_ARGUMENTS_LENGTH) {
      return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
    }

    // Decode in chunks to avoid "call stack size exceeded".
    var res = '';
    var i = 0;
    while (i < len) {
      res += String.fromCharCode.apply(
        String,
        codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
      );
    }
    return res
  }

  function asciiSlice (buf, start, end) {
    var ret = '';
    end = Math.min(buf.length, end);

    for (var i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i] & 0x7F);
    }
    return ret
  }

  function latin1Slice (buf, start, end) {
    var ret = '';
    end = Math.min(buf.length, end);

    for (var i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i]);
    }
    return ret
  }

  function hexSlice (buf, start, end) {
    var len = buf.length;

    if (!start || start < 0) start = 0;
    if (!end || end < 0 || end > len) end = len;

    var out = '';
    for (var i = start; i < end; ++i) {
      out += toHex(buf[i]);
    }
    return out
  }

  function utf16leSlice (buf, start, end) {
    var bytes = buf.slice(start, end);
    var res = '';
    for (var i = 0; i < bytes.length; i += 2) {
      res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
    }
    return res
  }

  Buffer.prototype.slice = function slice (start, end) {
    var len = this.length;
    start = ~~start;
    end = end === undefined ? len : ~~end;

    if (start < 0) {
      start += len;
      if (start < 0) start = 0;
    } else if (start > len) {
      start = len;
    }

    if (end < 0) {
      end += len;
      if (end < 0) end = 0;
    } else if (end > len) {
      end = len;
    }

    if (end < start) end = start;

    var newBuf;
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      newBuf = this.subarray(start, end);
      newBuf.__proto__ = Buffer.prototype;
    } else {
      var sliceLen = end - start;
      newBuf = new Buffer(sliceLen, undefined);
      for (var i = 0; i < sliceLen; ++i) {
        newBuf[i] = this[i + start];
      }
    }

    return newBuf
  };

  /*
   * Need to make sure that buffer isn't trying to write out of bounds.
   */
  function checkOffset (offset, ext, length) {
    if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
    if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
  }

  Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);

    var val = this[offset];
    var mul = 1;
    var i = 0;
    while (++i < byteLength && (mul *= 0x100)) {
      val += this[offset + i] * mul;
    }

    return val
  };

  Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) {
      checkOffset(offset, byteLength, this.length);
    }

    var val = this[offset + --byteLength];
    var mul = 1;
    while (byteLength > 0 && (mul *= 0x100)) {
      val += this[offset + --byteLength] * mul;
    }

    return val
  };

  Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 1, this.length);
    return this[offset]
  };

  Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] | (this[offset + 1] << 8)
  };

  Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    return (this[offset] << 8) | this[offset + 1]
  };

  Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);

    return ((this[offset]) |
        (this[offset + 1] << 8) |
        (this[offset + 2] << 16)) +
        (this[offset + 3] * 0x1000000)
  };

  Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);

    return (this[offset] * 0x1000000) +
      ((this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      this[offset + 3])
  };

  Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);

    var val = this[offset];
    var mul = 1;
    var i = 0;
    while (++i < byteLength && (mul *= 0x100)) {
      val += this[offset + i] * mul;
    }
    mul *= 0x80;

    if (val >= mul) val -= Math.pow(2, 8 * byteLength);

    return val
  };

  Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);

    var i = byteLength;
    var mul = 1;
    var val = this[offset + --i];
    while (i > 0 && (mul *= 0x100)) {
      val += this[offset + --i] * mul;
    }
    mul *= 0x80;

    if (val >= mul) val -= Math.pow(2, 8 * byteLength);

    return val
  };

  Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 1, this.length);
    if (!(this[offset] & 0x80)) return (this[offset])
    return ((0xff - this[offset] + 1) * -1)
  };

  Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    var val = this[offset] | (this[offset + 1] << 8);
    return (val & 0x8000) ? val | 0xFFFF0000 : val
  };

  Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    var val = this[offset + 1] | (this[offset] << 8);
    return (val & 0x8000) ? val | 0xFFFF0000 : val
  };

  Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);

    return (this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16) |
      (this[offset + 3] << 24)
  };

  Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);

    return (this[offset] << 24) |
      (this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      (this[offset + 3])
  };

  Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return read(this, offset, true, 23, 4)
  };

  Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return read(this, offset, false, 23, 4)
  };

  Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 8, this.length);
    return read(this, offset, true, 52, 8)
  };

  Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 8, this.length);
    return read(this, offset, false, 52, 8)
  };

  function checkInt (buf, value, offset, ext, max, min) {
    if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
    if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
    if (offset + ext > buf.length) throw new RangeError('Index out of range')
  }

  Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) {
      var maxBytes = Math.pow(2, 8 * byteLength) - 1;
      checkInt(this, value, offset, byteLength, maxBytes, 0);
    }

    var mul = 1;
    var i = 0;
    this[offset] = value & 0xFF;
    while (++i < byteLength && (mul *= 0x100)) {
      this[offset + i] = (value / mul) & 0xFF;
    }

    return offset + byteLength
  };

  Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) {
      var maxBytes = Math.pow(2, 8 * byteLength) - 1;
      checkInt(this, value, offset, byteLength, maxBytes, 0);
    }

    var i = byteLength - 1;
    var mul = 1;
    this[offset + i] = value & 0xFF;
    while (--i >= 0 && (mul *= 0x100)) {
      this[offset + i] = (value / mul) & 0xFF;
    }

    return offset + byteLength
  };

  Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
    this[offset] = (value & 0xff);
    return offset + 1
  };

  function objectWriteUInt16 (buf, value, offset, littleEndian) {
    if (value < 0) value = 0xffff + value + 1;
    for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
      buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
        (littleEndian ? i : 1 - i) * 8;
    }
  }

  Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = (value & 0xff);
      this[offset + 1] = (value >>> 8);
    } else {
      objectWriteUInt16(this, value, offset, true);
    }
    return offset + 2
  };

  Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = (value >>> 8);
      this[offset + 1] = (value & 0xff);
    } else {
      objectWriteUInt16(this, value, offset, false);
    }
    return offset + 2
  };

  function objectWriteUInt32 (buf, value, offset, littleEndian) {
    if (value < 0) value = 0xffffffff + value + 1;
    for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
      buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
    }
  }

  Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset + 3] = (value >>> 24);
      this[offset + 2] = (value >>> 16);
      this[offset + 1] = (value >>> 8);
      this[offset] = (value & 0xff);
    } else {
      objectWriteUInt32(this, value, offset, true);
    }
    return offset + 4
  };

  Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = (value >>> 24);
      this[offset + 1] = (value >>> 16);
      this[offset + 2] = (value >>> 8);
      this[offset + 3] = (value & 0xff);
    } else {
      objectWriteUInt32(this, value, offset, false);
    }
    return offset + 4
  };

  Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) {
      var limit = Math.pow(2, 8 * byteLength - 1);

      checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }

    var i = 0;
    var mul = 1;
    var sub = 0;
    this[offset] = value & 0xFF;
    while (++i < byteLength && (mul *= 0x100)) {
      if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
        sub = 1;
      }
      this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
    }

    return offset + byteLength
  };

  Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) {
      var limit = Math.pow(2, 8 * byteLength - 1);

      checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }

    var i = byteLength - 1;
    var mul = 1;
    var sub = 0;
    this[offset + i] = value & 0xFF;
    while (--i >= 0 && (mul *= 0x100)) {
      if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
        sub = 1;
      }
      this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
    }

    return offset + byteLength
  };

  Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
    if (value < 0) value = 0xff + value + 1;
    this[offset] = (value & 0xff);
    return offset + 1
  };

  Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = (value & 0xff);
      this[offset + 1] = (value >>> 8);
    } else {
      objectWriteUInt16(this, value, offset, true);
    }
    return offset + 2
  };

  Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = (value >>> 8);
      this[offset + 1] = (value & 0xff);
    } else {
      objectWriteUInt16(this, value, offset, false);
    }
    return offset + 2
  };

  Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = (value & 0xff);
      this[offset + 1] = (value >>> 8);
      this[offset + 2] = (value >>> 16);
      this[offset + 3] = (value >>> 24);
    } else {
      objectWriteUInt32(this, value, offset, true);
    }
    return offset + 4
  };

  Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
    if (value < 0) value = 0xffffffff + value + 1;
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = (value >>> 24);
      this[offset + 1] = (value >>> 16);
      this[offset + 2] = (value >>> 8);
      this[offset + 3] = (value & 0xff);
    } else {
      objectWriteUInt32(this, value, offset, false);
    }
    return offset + 4
  };

  function checkIEEE754 (buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length) throw new RangeError('Index out of range')
    if (offset < 0) throw new RangeError('Index out of range')
  }

  function writeFloat (buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 4);
    }
    write(buf, value, offset, littleEndian, 23, 4);
    return offset + 4
  }

  Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert)
  };

  Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert)
  };

  function writeDouble (buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 8);
    }
    write(buf, value, offset, littleEndian, 52, 8);
    return offset + 8
  }

  Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert)
  };

  Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert)
  };

  // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
  Buffer.prototype.copy = function copy (target, targetStart, start, end) {
    if (!start) start = 0;
    if (!end && end !== 0) end = this.length;
    if (targetStart >= target.length) targetStart = target.length;
    if (!targetStart) targetStart = 0;
    if (end > 0 && end < start) end = start;

    // Copy 0 bytes; we're done
    if (end === start) return 0
    if (target.length === 0 || this.length === 0) return 0

    // Fatal error conditions
    if (targetStart < 0) {
      throw new RangeError('targetStart out of bounds')
    }
    if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
    if (end < 0) throw new RangeError('sourceEnd out of bounds')

    // Are we oob?
    if (end > this.length) end = this.length;
    if (target.length - targetStart < end - start) {
      end = target.length - targetStart + start;
    }

    var len = end - start;
    var i;

    if (this === target && start < targetStart && targetStart < end) {
      // descending copy from end
      for (i = len - 1; i >= 0; --i) {
        target[i + targetStart] = this[i + start];
      }
    } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
      // ascending copy from start
      for (i = 0; i < len; ++i) {
        target[i + targetStart] = this[i + start];
      }
    } else {
      Uint8Array.prototype.set.call(
        target,
        this.subarray(start, start + len),
        targetStart
      );
    }

    return len
  };

  // Usage:
  //    buffer.fill(number[, offset[, end]])
  //    buffer.fill(buffer[, offset[, end]])
  //    buffer.fill(string[, offset[, end]][, encoding])
  Buffer.prototype.fill = function fill (val, start, end, encoding) {
    // Handle string cases:
    if (typeof val === 'string') {
      if (typeof start === 'string') {
        encoding = start;
        start = 0;
        end = this.length;
      } else if (typeof end === 'string') {
        encoding = end;
        end = this.length;
      }
      if (val.length === 1) {
        var code = val.charCodeAt(0);
        if (code < 256) {
          val = code;
        }
      }
      if (encoding !== undefined && typeof encoding !== 'string') {
        throw new TypeError('encoding must be a string')
      }
      if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
        throw new TypeError('Unknown encoding: ' + encoding)
      }
    } else if (typeof val === 'number') {
      val = val & 255;
    }

    // Invalid ranges are not set to a default, so can range check early.
    if (start < 0 || this.length < start || this.length < end) {
      throw new RangeError('Out of range index')
    }

    if (end <= start) {
      return this
    }

    start = start >>> 0;
    end = end === undefined ? this.length : end >>> 0;

    if (!val) val = 0;

    var i;
    if (typeof val === 'number') {
      for (i = start; i < end; ++i) {
        this[i] = val;
      }
    } else {
      var bytes = internalIsBuffer(val)
        ? val
        : utf8ToBytes(new Buffer(val, encoding).toString());
      var len = bytes.length;
      for (i = 0; i < end - start; ++i) {
        this[i + start] = bytes[i % len];
      }
    }

    return this
  };

  // HELPER FUNCTIONS
  // ================

  var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

  function base64clean (str) {
    // Node strips out invalid characters like \n and \t from the string, base64-js does not
    str = stringtrim(str).replace(INVALID_BASE64_RE, '');
    // Node converts strings with length < 2 to ''
    if (str.length < 2) return ''
    // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
    while (str.length % 4 !== 0) {
      str = str + '=';
    }
    return str
  }

  function stringtrim (str) {
    if (str.trim) return str.trim()
    return str.replace(/^\s+|\s+$/g, '')
  }

  function toHex (n) {
    if (n < 16) return '0' + n.toString(16)
    return n.toString(16)
  }

  function utf8ToBytes (string, units) {
    units = units || Infinity;
    var codePoint;
    var length = string.length;
    var leadSurrogate = null;
    var bytes = [];

    for (var i = 0; i < length; ++i) {
      codePoint = string.charCodeAt(i);

      // is surrogate component
      if (codePoint > 0xD7FF && codePoint < 0xE000) {
        // last char was a lead
        if (!leadSurrogate) {
          // no lead yet
          if (codePoint > 0xDBFF) {
            // unexpected trail
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
            continue
          } else if (i + 1 === length) {
            // unpaired lead
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
            continue
          }

          // valid lead
          leadSurrogate = codePoint;

          continue
        }

        // 2 leads in a row
        if (codePoint < 0xDC00) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          leadSurrogate = codePoint;
          continue
        }

        // valid surrogate pair
        codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
      } else if (leadSurrogate) {
        // valid bmp char, but last char was a lead
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
      }

      leadSurrogate = null;

      // encode utf8
      if (codePoint < 0x80) {
        if ((units -= 1) < 0) break
        bytes.push(codePoint);
      } else if (codePoint < 0x800) {
        if ((units -= 2) < 0) break
        bytes.push(
          codePoint >> 0x6 | 0xC0,
          codePoint & 0x3F | 0x80
        );
      } else if (codePoint < 0x10000) {
        if ((units -= 3) < 0) break
        bytes.push(
          codePoint >> 0xC | 0xE0,
          codePoint >> 0x6 & 0x3F | 0x80,
          codePoint & 0x3F | 0x80
        );
      } else if (codePoint < 0x110000) {
        if ((units -= 4) < 0) break
        bytes.push(
          codePoint >> 0x12 | 0xF0,
          codePoint >> 0xC & 0x3F | 0x80,
          codePoint >> 0x6 & 0x3F | 0x80,
          codePoint & 0x3F | 0x80
        );
      } else {
        throw new Error('Invalid code point')
      }
    }

    return bytes
  }

  function asciiToBytes (str) {
    var byteArray = [];
    for (var i = 0; i < str.length; ++i) {
      // Node's code seems to be doing this and not & 0x7F..
      byteArray.push(str.charCodeAt(i) & 0xFF);
    }
    return byteArray
  }

  function utf16leToBytes (str, units) {
    var c, hi, lo;
    var byteArray = [];
    for (var i = 0; i < str.length; ++i) {
      if ((units -= 2) < 0) break

      c = str.charCodeAt(i);
      hi = c >> 8;
      lo = c % 256;
      byteArray.push(lo);
      byteArray.push(hi);
    }

    return byteArray
  }


  function base64ToBytes (str) {
    return toByteArray(base64clean(str))
  }

  function blitBuffer (src, dst, offset, length) {
    for (var i = 0; i < length; ++i) {
      if ((i + offset >= dst.length) || (i >= src.length)) break
      dst[i + offset] = src[i];
    }
    return i
  }

  function isnan (val) {
    return val !== val // eslint-disable-line no-self-compare
  }


  // the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
  // The _isBuffer check is for Safari 5-7 support, because it's missing
  // Object.prototype.constructor. Remove this eventually
  function isBuffer(obj) {
    return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
  }

  function isFastBuffer (obj) {
    return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
  }

  // For Node v0.10 support. Remove this eventually.
  function isSlowBuffer (obj) {
    return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
  }

  var inherits;
  if (typeof Object.create === 'function'){
    inherits = function inherits(ctor, superCtor) {
      // implementation from standard node.js 'util' module
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    };
  } else {
    inherits = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function () {};
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    };
  }

  /**
   * Echos the value of a value. Trys to print the value out
   * in the best way possible given the different types.
   *
   * @param {Object} obj The object to print out.
   * @param {Object} opts Optional options object that alters the output.
   */
  /* legacy: obj, showHidden, depth, colors*/
  function inspect$1(obj, opts) {
    // default options
    var ctx = {
      seen: [],
      stylize: stylizeNoColor
    };
    // legacy...
    if (arguments.length >= 3) ctx.depth = arguments[2];
    if (arguments.length >= 4) ctx.colors = arguments[3];
    if (isBoolean(opts)) {
      // legacy...
      ctx.showHidden = opts;
    } else if (opts) {
      // got an "options" object
      _extend(ctx, opts);
    }
    // set default options
    if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
    if (isUndefined(ctx.depth)) ctx.depth = 2;
    if (isUndefined(ctx.colors)) ctx.colors = false;
    if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
    if (ctx.colors) ctx.stylize = stylizeWithColor;
    return formatValue(ctx, obj, ctx.depth);
  }

  // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
  inspect$1.colors = {
    'bold' : [1, 22],
    'italic' : [3, 23],
    'underline' : [4, 24],
    'inverse' : [7, 27],
    'white' : [37, 39],
    'grey' : [90, 39],
    'black' : [30, 39],
    'blue' : [34, 39],
    'cyan' : [36, 39],
    'green' : [32, 39],
    'magenta' : [35, 39],
    'red' : [31, 39],
    'yellow' : [33, 39]
  };

  // Don't use 'blue' not visible on cmd.exe
  inspect$1.styles = {
    'special': 'cyan',
    'number': 'yellow',
    'boolean': 'yellow',
    'undefined': 'grey',
    'null': 'bold',
    'string': 'green',
    'date': 'magenta',
    // "name": intentionally not styling
    'regexp': 'red'
  };


  function stylizeWithColor(str, styleType) {
    var style = inspect$1.styles[styleType];

    if (style) {
      return '\u001b[' + inspect$1.colors[style][0] + 'm' + str +
             '\u001b[' + inspect$1.colors[style][1] + 'm';
    } else {
      return str;
    }
  }


  function stylizeNoColor(str, styleType) {
    return str;
  }


  function arrayToHash(array) {
    var hash = {};

    array.forEach(function(val, idx) {
      hash[val] = true;
    });

    return hash;
  }


  function formatValue(ctx, value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (ctx.customInspect &&
        value &&
        isFunction(value.inspect) &&
        // Filter out the util module, it's inspect function is special
        value.inspect !== inspect$1 &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
      var ret = value.inspect(recurseTimes, ctx);
      if (!isString(ret)) {
        ret = formatValue(ctx, ret, recurseTimes);
      }
      return ret;
    }

    // Primitive types cannot have properties
    var primitive = formatPrimitive(ctx, value);
    if (primitive) {
      return primitive;
    }

    // Look up the keys of the object.
    var keys = Object.keys(value);
    var visibleKeys = arrayToHash(keys);

    if (ctx.showHidden) {
      keys = Object.getOwnPropertyNames(value);
    }

    // IE doesn't make error fields non-enumerable
    // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
    if (isError(value)
        && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
      return formatError(value);
    }

    // Some type of object without properties can be shortcutted.
    if (keys.length === 0) {
      if (isFunction(value)) {
        var name = value.name ? ': ' + value.name : '';
        return ctx.stylize('[Function' + name + ']', 'special');
      }
      if (isRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
      }
      if (isDate(value)) {
        return ctx.stylize(Date.prototype.toString.call(value), 'date');
      }
      if (isError(value)) {
        return formatError(value);
      }
    }

    var base = '', array = false, braces = ['{', '}'];

    // Make Array say that they are Array
    if (isArray(value)) {
      array = true;
      braces = ['[', ']'];
    }

    // Make functions say that they are functions
    if (isFunction(value)) {
      var n = value.name ? ': ' + value.name : '';
      base = ' [Function' + n + ']';
    }

    // Make RegExps say that they are RegExps
    if (isRegExp(value)) {
      base = ' ' + RegExp.prototype.toString.call(value);
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ' ' + Date.prototype.toUTCString.call(value);
    }

    // Make error with message first say the error
    if (isError(value)) {
      base = ' ' + formatError(value);
    }

    if (keys.length === 0 && (!array || value.length == 0)) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
      } else {
        return ctx.stylize('[Object]', 'special');
      }
    }

    ctx.seen.push(value);

    var output;
    if (array) {
      output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
    } else {
      output = keys.map(function(key) {
        return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
      });
    }

    ctx.seen.pop();

    return reduceToSingleString(output, base, braces);
  }


  function formatPrimitive(ctx, value) {
    if (isUndefined(value))
      return ctx.stylize('undefined', 'undefined');
    if (isString(value)) {
      var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                               .replace(/'/g, "\\'")
                                               .replace(/\\"/g, '"') + '\'';
      return ctx.stylize(simple, 'string');
    }
    if (isNumber(value))
      return ctx.stylize('' + value, 'number');
    if (isBoolean(value))
      return ctx.stylize('' + value, 'boolean');
    // For some reason typeof null is "object", so special case here.
    if (isNull(value))
      return ctx.stylize('null', 'null');
  }


  function formatError(value) {
    return '[' + Error.prototype.toString.call(value) + ']';
  }


  function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
    var output = [];
    for (var i = 0, l = value.length; i < l; ++i) {
      if (hasOwnProperty(value, String(i))) {
        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
            String(i), true));
      } else {
        output.push('');
      }
    }
    keys.forEach(function(key) {
      if (!key.match(/^\d+$/)) {
        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
            key, true));
      }
    });
    return output;
  }


  function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
    var name, str, desc;
    desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
    if (desc.get) {
      if (desc.set) {
        str = ctx.stylize('[Getter/Setter]', 'special');
      } else {
        str = ctx.stylize('[Getter]', 'special');
      }
    } else {
      if (desc.set) {
        str = ctx.stylize('[Setter]', 'special');
      }
    }
    if (!hasOwnProperty(visibleKeys, key)) {
      name = '[' + key + ']';
    }
    if (!str) {
      if (ctx.seen.indexOf(desc.value) < 0) {
        if (isNull(recurseTimes)) {
          str = formatValue(ctx, desc.value, null);
        } else {
          str = formatValue(ctx, desc.value, recurseTimes - 1);
        }
        if (str.indexOf('\n') > -1) {
          if (array) {
            str = str.split('\n').map(function(line) {
              return '  ' + line;
            }).join('\n').substr(2);
          } else {
            str = '\n' + str.split('\n').map(function(line) {
              return '   ' + line;
            }).join('\n');
          }
        }
      } else {
        str = ctx.stylize('[Circular]', 'special');
      }
    }
    if (isUndefined(name)) {
      if (array && key.match(/^\d+$/)) {
        return str;
      }
      name = JSON.stringify('' + key);
      if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
        name = name.substr(1, name.length - 2);
        name = ctx.stylize(name, 'name');
      } else {
        name = name.replace(/'/g, "\\'")
                   .replace(/\\"/g, '"')
                   .replace(/(^"|"$)/g, "'");
        name = ctx.stylize(name, 'string');
      }
    }

    return name + ': ' + str;
  }


  function reduceToSingleString(output, base, braces) {
    var length = output.reduce(function(prev, cur) {
      if (cur.indexOf('\n') >= 0) ;
      return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
    }, 0);

    if (length > 60) {
      return braces[0] +
             (base === '' ? '' : base + '\n ') +
             ' ' +
             output.join(',\n  ') +
             ' ' +
             braces[1];
    }

    return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
  }


  // NOTE: These type checking functions intentionally don't use `instanceof`
  // because it is fragile and can be easily faked with `Object.create()`.
  function isArray(ar) {
    return Array.isArray(ar);
  }

  function isBoolean(arg) {
    return typeof arg === 'boolean';
  }

  function isNull(arg) {
    return arg === null;
  }

  function isNumber(arg) {
    return typeof arg === 'number';
  }

  function isString(arg) {
    return typeof arg === 'string';
  }

  function isUndefined(arg) {
    return arg === void 0;
  }

  function isRegExp(re) {
    return isObject(re) && objectToString(re) === '[object RegExp]';
  }

  function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
  }

  function isDate(d) {
    return isObject(d) && objectToString(d) === '[object Date]';
  }

  function isError(e) {
    return isObject(e) &&
        (objectToString(e) === '[object Error]' || e instanceof Error);
  }

  function isFunction(arg) {
    return typeof arg === 'function';
  }

  function isPrimitive(arg) {
    return arg === null ||
           typeof arg === 'boolean' ||
           typeof arg === 'number' ||
           typeof arg === 'string' ||
           typeof arg === 'symbol' ||  // ES6 symbol
           typeof arg === 'undefined';
  }

  function objectToString(o) {
    return Object.prototype.toString.call(o);
  }

  function _extend(origin, add) {
    // Don't do anything if add isn't an object
    if (!add || !isObject(add)) return origin;

    var keys = Object.keys(add);
    var i = keys.length;
    while (i--) {
      origin[keys[i]] = add[keys[i]];
    }
    return origin;
  }
  function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  function compare(a, b) {
    if (a === b) {
      return 0;
    }

    var x = a.length;
    var y = b.length;

    for (var i = 0, len = Math.min(x, y); i < len; ++i) {
      if (a[i] !== b[i]) {
        x = a[i];
        y = b[i];
        break;
      }
    }

    if (x < y) {
      return -1;
    }
    if (y < x) {
      return 1;
    }
    return 0;
  }
  var hasOwn = Object.prototype.hasOwnProperty;

  var objectKeys = Object.keys || function (obj) {
    var keys = [];
    for (var key in obj) {
      if (hasOwn.call(obj, key)) keys.push(key);
    }
    return keys;
  };
  var pSlice = Array.prototype.slice;
  var _functionsHaveNames;
  function functionsHaveNames() {
    if (typeof _functionsHaveNames !== 'undefined') {
      return _functionsHaveNames;
    }
    return _functionsHaveNames = (function () {
      return function foo() {}.name === 'foo';
    }());
  }
  function pToString (obj) {
    return Object.prototype.toString.call(obj);
  }
  function isView(arrbuf) {
    if (isBuffer(arrbuf)) {
      return false;
    }
    if (typeof global$1.ArrayBuffer !== 'function') {
      return false;
    }
    if (typeof ArrayBuffer.isView === 'function') {
      return ArrayBuffer.isView(arrbuf);
    }
    if (!arrbuf) {
      return false;
    }
    if (arrbuf instanceof DataView) {
      return true;
    }
    if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
      return true;
    }
    return false;
  }
  // 1. The assert module provides functions that throw
  // AssertionError's when particular conditions are not met. The
  // assert module must conform to the following interface.

  function assert(value, message) {
    if (!value) fail(value, true, message, '==', ok);
  }

  // 2. The AssertionError is defined in assert.
  // new assert.AssertionError({ message: message,
  //                             actual: actual,
  //                             expected: expected })

  var regex = /\s*function\s+([^\(\s]*)\s*/;
  // based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
  function getName(func) {
    if (!isFunction(func)) {
      return;
    }
    if (functionsHaveNames()) {
      return func.name;
    }
    var str = func.toString();
    var match = str.match(regex);
    return match && match[1];
  }
  assert.AssertionError = AssertionError;
  function AssertionError(options) {
    this.name = 'AssertionError';
    this.actual = options.actual;
    this.expected = options.expected;
    this.operator = options.operator;
    if (options.message) {
      this.message = options.message;
      this.generatedMessage = false;
    } else {
      this.message = getMessage(this);
      this.generatedMessage = true;
    }
    var stackStartFunction = options.stackStartFunction || fail;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, stackStartFunction);
    } else {
      // non v8 browsers so we can have a stacktrace
      var err = new Error();
      if (err.stack) {
        var out = err.stack;

        // try to strip useless frames
        var fn_name = getName(stackStartFunction);
        var idx = out.indexOf('\n' + fn_name);
        if (idx >= 0) {
          // once we have located the function frame
          // we need to strip out everything before it (and its line)
          var next_line = out.indexOf('\n', idx + 1);
          out = out.substring(next_line + 1);
        }

        this.stack = out;
      }
    }
  }

  // assert.AssertionError instanceof Error
  inherits(AssertionError, Error);

  function truncate(s, n) {
    if (typeof s === 'string') {
      return s.length < n ? s : s.slice(0, n);
    } else {
      return s;
    }
  }
  function inspect(something) {
    if (functionsHaveNames() || !isFunction(something)) {
      return inspect$1(something);
    }
    var rawname = getName(something);
    var name = rawname ? ': ' + rawname : '';
    return '[Function' +  name + ']';
  }
  function getMessage(self) {
    return truncate(inspect(self.actual), 128) + ' ' +
           self.operator + ' ' +
           truncate(inspect(self.expected), 128);
  }

  // At present only the three keys mentioned above are used and
  // understood by the spec. Implementations or sub modules can pass
  // other keys to the AssertionError's constructor - they will be
  // ignored.

  // 3. All of the following functions must throw an AssertionError
  // when a corresponding condition is not met, with a message that
  // may be undefined if not provided.  All assertion methods provide
  // both the actual and expected values to the assertion error for
  // display purposes.

  function fail(actual, expected, message, operator, stackStartFunction) {
    throw new AssertionError({
      message: message,
      actual: actual,
      expected: expected,
      operator: operator,
      stackStartFunction: stackStartFunction
    });
  }

  // EXTENSION! allows for well behaved errors defined elsewhere.
  assert.fail = fail;

  // 4. Pure assertion tests whether a value is truthy, as determined
  // by !!guard.
  // assert.ok(guard, message_opt);
  // This statement is equivalent to assert.equal(true, !!guard,
  // message_opt);. To test strictly for the value true, use
  // assert.strictEqual(true, guard, message_opt);.

  function ok(value, message) {
    if (!value) fail(value, true, message, '==', ok);
  }
  assert.ok = ok;

  // 5. The equality assertion tests shallow, coercive equality with
  // ==.
  // assert.equal(actual, expected, message_opt);
  assert.equal = equal;
  function equal(actual, expected, message) {
    if (actual != expected) fail(actual, expected, message, '==', equal);
  }

  // 6. The non-equality assertion tests for whether two objects are not equal
  // with != assert.notEqual(actual, expected, message_opt);
  assert.notEqual = notEqual;
  function notEqual(actual, expected, message) {
    if (actual == expected) {
      fail(actual, expected, message, '!=', notEqual);
    }
  }

  // 7. The equivalence assertion tests a deep equality relation.
  // assert.deepEqual(actual, expected, message_opt);
  assert.deepEqual = deepEqual;
  function deepEqual(actual, expected, message) {
    if (!_deepEqual(actual, expected, false)) {
      fail(actual, expected, message, 'deepEqual', deepEqual);
    }
  }
  assert.deepStrictEqual = deepStrictEqual;
  function deepStrictEqual(actual, expected, message) {
    if (!_deepEqual(actual, expected, true)) {
      fail(actual, expected, message, 'deepStrictEqual', deepStrictEqual);
    }
  }

  function _deepEqual(actual, expected, strict, memos) {
    // 7.1. All identical values are equivalent, as determined by ===.
    if (actual === expected) {
      return true;
    } else if (isBuffer(actual) && isBuffer(expected)) {
      return compare(actual, expected) === 0;

    // 7.2. If the expected value is a Date object, the actual value is
    // equivalent if it is also a Date object that refers to the same time.
    } else if (isDate(actual) && isDate(expected)) {
      return actual.getTime() === expected.getTime();

    // 7.3 If the expected value is a RegExp object, the actual value is
    // equivalent if it is also a RegExp object with the same source and
    // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
    } else if (isRegExp(actual) && isRegExp(expected)) {
      return actual.source === expected.source &&
             actual.global === expected.global &&
             actual.multiline === expected.multiline &&
             actual.lastIndex === expected.lastIndex &&
             actual.ignoreCase === expected.ignoreCase;

    // 7.4. Other pairs that do not both pass typeof value == 'object',
    // equivalence is determined by ==.
    } else if ((actual === null || typeof actual !== 'object') &&
               (expected === null || typeof expected !== 'object')) {
      return strict ? actual === expected : actual == expected;

    // If both values are instances of typed arrays, wrap their underlying
    // ArrayBuffers in a Buffer each to increase performance
    // This optimization requires the arrays to have the same type as checked by
    // Object.prototype.toString (aka pToString). Never perform binary
    // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
    // bit patterns are not identical.
    } else if (isView(actual) && isView(expected) &&
               pToString(actual) === pToString(expected) &&
               !(actual instanceof Float32Array ||
                 actual instanceof Float64Array)) {
      return compare(new Uint8Array(actual.buffer),
                     new Uint8Array(expected.buffer)) === 0;

    // 7.5 For all other Object pairs, including Array objects, equivalence is
    // determined by having the same number of owned properties (as verified
    // with Object.prototype.hasOwnProperty.call), the same set of keys
    // (although not necessarily the same order), equivalent values for every
    // corresponding key, and an identical 'prototype' property. Note: this
    // accounts for both named and indexed properties on Arrays.
    } else if (isBuffer(actual) !== isBuffer(expected)) {
      return false;
    } else {
      memos = memos || {actual: [], expected: []};

      var actualIndex = memos.actual.indexOf(actual);
      if (actualIndex !== -1) {
        if (actualIndex === memos.expected.indexOf(expected)) {
          return true;
        }
      }

      memos.actual.push(actual);
      memos.expected.push(expected);

      return objEquiv(actual, expected, strict, memos);
    }
  }

  function isArguments(object) {
    return Object.prototype.toString.call(object) == '[object Arguments]';
  }

  function objEquiv(a, b, strict, actualVisitedObjects) {
    if (a === null || a === undefined || b === null || b === undefined)
      return false;
    // if one is a primitive, the other must be same
    if (isPrimitive(a) || isPrimitive(b))
      return a === b;
    if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
      return false;
    var aIsArgs = isArguments(a);
    var bIsArgs = isArguments(b);
    if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
      return false;
    if (aIsArgs) {
      a = pSlice.call(a);
      b = pSlice.call(b);
      return _deepEqual(a, b, strict);
    }
    var ka = objectKeys(a);
    var kb = objectKeys(b);
    var key, i;
    // having the same number of owned properties (keys incorporates
    // hasOwnProperty)
    if (ka.length !== kb.length)
      return false;
    //the same set of keys (although not necessarily the same order),
    ka.sort();
    kb.sort();
    //~~~cheap key test
    for (i = ka.length - 1; i >= 0; i--) {
      if (ka[i] !== kb[i])
        return false;
    }
    //equivalent values for every corresponding key, and
    //~~~possibly expensive deep test
    for (i = ka.length - 1; i >= 0; i--) {
      key = ka[i];
      if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
        return false;
    }
    return true;
  }

  // 8. The non-equivalence assertion tests for any deep inequality.
  // assert.notDeepEqual(actual, expected, message_opt);
  assert.notDeepEqual = notDeepEqual;
  function notDeepEqual(actual, expected, message) {
    if (_deepEqual(actual, expected, false)) {
      fail(actual, expected, message, 'notDeepEqual', notDeepEqual);
    }
  }

  assert.notDeepStrictEqual = notDeepStrictEqual;
  function notDeepStrictEqual(actual, expected, message) {
    if (_deepEqual(actual, expected, true)) {
      fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
    }
  }


  // 9. The strict equality assertion tests strict equality, as determined by ===.
  // assert.strictEqual(actual, expected, message_opt);
  assert.strictEqual = strictEqual;
  function strictEqual(actual, expected, message) {
    if (actual !== expected) {
      fail(actual, expected, message, '===', strictEqual);
    }
  }

  // 10. The strict non-equality assertion tests for strict inequality, as
  // determined by !==.  assert.notStrictEqual(actual, expected, message_opt);
  assert.notStrictEqual = notStrictEqual;
  function notStrictEqual(actual, expected, message) {
    if (actual === expected) {
      fail(actual, expected, message, '!==', notStrictEqual);
    }
  }

  function expectedException(actual, expected) {
    if (!actual || !expected) {
      return false;
    }

    if (Object.prototype.toString.call(expected) == '[object RegExp]') {
      return expected.test(actual);
    }

    try {
      if (actual instanceof expected) {
        return true;
      }
    } catch (e) {
      // Ignore.  The instanceof check doesn't work for arrow functions.
    }

    if (Error.isPrototypeOf(expected)) {
      return false;
    }

    return expected.call({}, actual) === true;
  }

  function _tryBlock(block) {
    var error;
    try {
      block();
    } catch (e) {
      error = e;
    }
    return error;
  }

  function _throws(shouldThrow, block, expected, message) {
    var actual;

    if (typeof block !== 'function') {
      throw new TypeError('"block" argument must be a function');
    }

    if (typeof expected === 'string') {
      message = expected;
      expected = null;
    }

    actual = _tryBlock(block);

    message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
              (message ? ' ' + message : '.');

    if (shouldThrow && !actual) {
      fail(actual, expected, 'Missing expected exception' + message);
    }

    var userProvidedMessage = typeof message === 'string';
    var isUnwantedException = !shouldThrow && isError(actual);
    var isUnexpectedException = !shouldThrow && actual && !expected;

    if ((isUnwantedException &&
        userProvidedMessage &&
        expectedException(actual, expected)) ||
        isUnexpectedException) {
      fail(actual, expected, 'Got unwanted exception' + message);
    }

    if ((shouldThrow && actual && expected &&
        !expectedException(actual, expected)) || (!shouldThrow && actual)) {
      throw actual;
    }
  }

  // 11. Expected to throw an error:
  // assert.throws(block, Error_opt, message_opt);
  assert.throws = throws;
  function throws(block, /*optional*/error, /*optional*/message) {
    _throws(true, block, error, message);
  }

  // EXTENSION! This is annoying to write outside this module.
  assert.doesNotThrow = doesNotThrow;
  function doesNotThrow(block, /*optional*/error, /*optional*/message) {
    _throws(false, block, error, message);
  }

  assert.ifError = ifError;
  function ifError(err) {
    if (err) throw err;
  }

  const modulo = (a, b) => ((+a % (b = +b)) + b) % b;
  const valid = (x) => (isNaN(x) ? undefined : x);

  function isOpen(x) {
    return (Array.isArray(x) && x.open);
  }

  function isClosed(x) {
    return (Array.isArray(x) && !x.open);
  }

  Array.prototype.toJSON = function () {
    if (this.open) {
      // throw new Error(`Cannot serialize open vector: ${JSON.stringify([...this])}.`);
      return {"OPEN VECTOR": [...this]};
    }
    return this;
  };

  const builtin = {
    "_log!": (arg) => {
      console.error(`_log!: ${JSON.stringify(arg)}`);
      return arg;
    },
    GT: (args) => {
      const [last, ...rest] = args;
      const [ok, _] = rest.reduce(
        ([ok, last], x) => [ok && last > x, x],
        [true, last]
      );
      if (ok) return args;
    },
    EQ: (args) => {
      const [first, ...rest] = args;
      const ok = rest.reduce((ok, x) => ok && first === x, true);
      if (ok) return args;
    },
    PLUS: (args) => valid(args.reduce((res, x) => res + x, 0)),
    TIMES: (args) => valid(args.reduce((res, x) => res * x, 1)),
    DIV: ([x, y]) => {
      const div = Math.floor(x / y);
      const rem = modulo(x, y);
      if (x === div * y + rem) return { div, rem };
    },
    FDIV: ([x, y]) => x / y,
    CONCAT: (strs) => strs.join(""),
    true: () => true,
    false: () => false,
    null: () => null,
    toJSON: (x) => JSON.stringify(x),
    fromJSON: (x) => JSON.parse(x),
    CONS: ([x, y]) => { try { return [x, ...y]; } catch (e) { return undefined; } },
    SNOC: (x) => (x.length > 1 ? [x[0], x.slice(1)] : undefined),
    toDateMsec: (x) => new Date(x).getTime(),
    toDateStr: (x) => new Date(x).toISOString(),
  };

  const codes = {
    int: (x) => Number.isInteger(x),
    string: (x) => x instanceof String || "string" === typeof x,
    bool: (x) => x === true || x === false,
  };

  function verify(code, value) {
    if (code == null) {
      // representatives = run.defs.representatives
      // defCodes = JSON.stringify run.defs.codes
      // console.log {code,value, representatives, defCodes}
      return false;
    }
    switch (code.code) {
      case "vector":
        if (!Array.isArray(value)) return false;
        return value.every((x) => verify(code.vector, x));
      case "product":
        if ("object" !== typeof value) return false;
        else {
          const fields = Object.keys(value);
          if (fields.length !== Object.keys(code.product).length) return false;
          return fields.every((label) =>
            verify(code.product[label], value[label])
          );
        }
      case "union":
        if ("object" !== typeof value) return false;
        else {
          const fields = Object.keys(value);
          if (fields.length !== 1) return false;
          return verify(code.union[fields[0]], value[fields[0]]);
        }
      default: {
        const c = run.defs.codes[run.defs.representatives[code]];
        if (c != null) return verify(c, value);
        return codes[code](value);
      }
    }
  }

  function run(exp, value) {
    if (value === undefined) return;
    while (true) {
      if (isOpen(value)) {
        if (exp.op === "caret2") return [...value];
        const result = [];
        result.open = true;
        for (const v of value) {
          const r = run(exp, v);
          if (r !== undefined) result.push(r);
        }
        return result;
      }
      switch (exp.op) {
        case "code":
          if (verify(exp.code, value)) {
            return value;
          }
          return;
        case "identity":
          return value;
        case "str":
        case "int":
          return exp[exp.op];
        case "ref":
          const defn = run.defs.rels[exp.ref];
          if (defn != null) {
            exp = defn[defn.length - 1];
            continue;
          }
          const builtin_func = builtin[exp.ref];
          if (builtin_func != null) {
            return builtin_func(value);
          }
          throw(`Unknown ref: '${exp.ref}'`);
        case "dot":
          // a hack to allow something like 'null . null' or '0 . 0' to work by returning unit
          if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            if (`${value}` === `${exp.dot}`) return {};
            return;
          }
          return value[exp.dot];
        case "pipe": {
          assert(isClosed(value), `PIPE (|): Only a regular vector value can be "open".`);
          const result = [...value];
          result.open = true;
          return result;
        }
        case "comp":
          for (let i = 0, len = exp.comp.length - 1; i < len; i++) {
            const result = run(exp.comp[i], value);
            if (result === undefined) return;
            value = result;
          }
          exp = exp.comp[exp.comp.length - 1];
          continue;
        case "union":
          if (exp.union.length === 0) return;
          for (let i = 0, len = exp.union.length -1; i < len; i++) {
            const result = run(exp.union[i], value);
            if (result !== undefined) {
              return result;
            }
          }
          exp = exp.union[exp.union.length - 1];
          continue;
        case "vector": {
          let result = [];
          let open = false;
          for (let i = 0, len = exp.vector.length; i < len; i++) {
            const r = run(exp.vector[i], value);
            if (r === undefined) return;
            if (open) {
              if (isOpen(r)) {
                const newResult = [];
                newResult.open = true;
                for (const x of result) {
                  for (const y of r) {
                    newResult.push([...x, y]);
                  }
                }
                result = newResult;
              } else {
                for (const x of result) x.push(r);
              }
            } else {
              if (isOpen(r)) {
                open = true;
                const newResult = [];
                newResult.open = true;
                for (const x of r) {
                  newResult.push([...result, x]);
                } 
                result = newResult;
              } else {
                result.push(r);
              }
            }
          }
          return result;
        }
        case "product": {
          let result = {};
          let open = false;
          for (let i = 0, len = exp.product.length; i < len; i++) {
            const { label, exp: e } = exp.product[i];
            const r = run(e, value);
            if (r === undefined) return;
            if (open) {
              if (isOpen(r)) {
                let newResult = [];
                newResult.open = true;
                for (const v of r) {
                  for (const x of result) {
                    newResult.push({...x, [label]: v});
                  }
                }
                result = newResult;
              } else {
                let newResult = [];
                newResult.open = true;
                for (const x of result) {
                  newResult.push({...x, [label]: r});
                }
                result = newResult;
              } 
            } else {
              if (isOpen(r)) {
                open = true;
                let newResult = [];
                newResult.open = true;
                for (const v of r.values()) {
                  newResult.push({...result, [label]: v});
                }
                result = newResult;
              } else {
                result[label] = r;
              }
            }      
          }
          return result
        }
        case "caret": {
          const result = run(exp.caret, value);
          assert(isOpen(result), "CARET (^): Only an 'open' vector can be closed.");
          return [...result];
        }  
        default:
          assert(false,`Unknown operation: '${exp.op}'`);
      
      }
    }}

  function isBuiltIn(code) {  
    return code.match(/^(int|string|bool)$/);
  }

  function encodeCodeToString(code, codes) {
    if (isBuiltIn(code)) return code;
    var i = 0;
    const Q = [[code,i]];
    const D = {[code]: i++};
    var result=[];
    while (Q.length > 0) {
      const [x,c] = Q.shift();
      const c_code = codes[x];
      if (c_code.code == "vector") {
        const u_arg = c_code.vector;
        if (isBuiltIn(u_arg)) {
          result.push(`$C${result.length}=[${u_arg}];`);
          continue;
        }
        if (D[u_arg] === undefined) {
          Q.push([u_arg,i]);
          D[u_arg] = i++;
        }
        result.push(`$C${result.length}=[C${D[u_arg]}];`);
        continue;
      }
      const u_args =  Object.keys(c_code[c_code.code]).sort().map((k) => {
        const u_arg = c_code[c_code.code][k];
        if (isBuiltIn(u_arg)) 
          return `${u_arg}${JSON.stringify(k)}`;
        if (D[u_arg] === undefined) {
          Q.push([u_arg,i]);
          D[u_arg] = i++;
        }
        return `C${D[u_arg]}${JSON.stringify(k)}`;
      });
      if (c_code.code == "union") {
        //result += `$${c}=<${u_args.join(",")}>;`;
        result.push(`$C${result.length}=<${u_args.join(",")}>;`);
      } else if (c_code.code == "product") {
        //result += `$${c}={${u_args.join(",")}};`;
        result.push(`$C${result.length}={${u_args.join(",")}};`);
      } else {
        throw new Error(`Unexpected code ${c_code.code}`);
      }
    }
    return result.join("");
  }
  function are_different(classes, representatives, name1, name2, codes) {
    if (name1 === name2) return false;
    const code1 = codes[name1];
    const code2 = codes[name2];
    if (code1.code !== code2.code) return true;
    switch (code1.code) {
      case "union":
      case "product":
        const [fields1, fields2] = [code1, code2].map((code) => {
          const arg = code[code.code];
          return Object.keys(arg).reduce((fields, label) => {
            const ref = representatives[arg[label]];
            fields[label] = ref != null ? ref : arg[label];
            return fields;
          }, {});
        });
        if (Object.keys(fields1).length !== Object.keys(fields2).length)
          return true;

        for (const field in fields1) {
          if (fields2[field] !== fields1[field]) return true;
        }
        break;
      case "vector":
        const [arg1, arg2] = [code1, code2].map(
          ({ vector }) => representatives[vector] || vector
        );
        if (arg1 !== arg2) return true;
    }
    return false;
  }

  function minimize(codes) {
    const names = Object.keys(codes);
    const classes = {};
    classes["{}"] = names;
    const representatives = names.reduce((representatives, name) => {
      representatives[name] = "{}";
      return representatives;
    }, {});
    let changed = true;
    while (changed) {
      changed = false;
      for (const name1 in classes) {
        const [eq_names, dif_names] = classes[name1].reduce(
          ([eq_names, dif_names], name2) => {
            if (are_different(classes, representatives, name1, name2, codes)) {
              dif_names.push(name2);
            } else {
              eq_names.push(name2);
            }
            return [eq_names, dif_names];
          },
          [[], []]
        );
        classes[name1] = eq_names;

        if (dif_names.length > 0) {
          const new_rep = dif_names[0];
          changed = true;
          classes[new_rep] = dif_names;
          dif_names.forEach((name) => (representatives[name] = new_rep));
        }
      }
    }

    return { classes, representatives };
  }

  function normalize(label_ref_map, representatives) {
    return Object.keys(label_ref_map).reduce((result, label) => {
      const name = label_ref_map[label];
      result[label] = representatives[name] || name;
      return result;
    }, {});
  }

  function normalizeAll(codes, representatives) {
    return Object.keys(codes).reduce(function (normalized, name) {
      if (name === representatives[name]) {
        const code = codes[name];
        switch (code.code) {
          case "union":
          case "product":
            normalized[name] = { ...code };
            normalized[name][code.code] = normalize(
              code[code.code],
              representatives
            );
            break;
          case "vector":
            normalized[name] = {
              ...code,
              vector: representatives[code.vector] || code.vector,
            };
        }
      }

      return normalized;
    }, {});
  }


  var t = { minimize, normalize, normalizeAll, encodeCodeToString };

  function finalize(codes) {
    const representatives = t.minimize(codes).representatives;
    const normalizedCodes = t.normalizeAll(codes, representatives);
    const globalNames = Object.keys(normalizedCodes).reduce((globalNames, name) => {
      const globalDef = t.encodeCodeToString(name, normalizedCodes);
      normalizedCodes[name].def = globalDef;
      globalNames[name] = hash(globalDef);
      return globalNames;
    }, {});
    const globalCodes = Object.keys(normalizedCodes).reduce((globalCodes, name) => {
      globalCodes[globalNames[name]] = normalizedCodes[name];
      return globalCodes;
    },{});
    // console.log("globalCodes",globalCodes);

    const extendedRepresentatives = Object.keys(representatives).reduce((result, name) => {
      result[name] = globalNames[representatives[name]] || name;
      return result;
    }, Object.values(globalNames).reduce((result, name) => ({[name]: name, ...result}),{}));
    // console.log("extendedRepresentatives",extendedRepresentatives);

    const normalizedGlobalCodes = t.normalizeAll(globalCodes, extendedRepresentatives);
    // console.log("normalizedGlobalCodes",normalizedGlobalCodes);

    
    return {
      codes: normalizedGlobalCodes,
      representatives: extendedRepresentatives
    };
  }

  function compile(script) {
    try {
      const {rels, codes, representatives } = annotate(script);
      run.defs = {rels, codes, representatives};
    } catch (e) {
      console.error(e);
      const { defs, exp } = ___parse(script);
      const { codes, representatives } = finalize(defs.codes);
      run.defs = {
        rels: {...defs.rels, "__main__": [exp]}, 
        codes, representatives
      };
      console.error("WARN: Recompiled without type reconciliation due to the type error above.");
    }
    return run.bind(null, run.defs.rels.__main__[0]);
  }

  compile.doc = "Transforms k-script (string) into a function";

  function runScriptOnData(script, data) {
    return compile(script)(data);
  }
  runScriptOnData.doc = "Run 'script' (string) on 'data': (script,data) -> data";


  function annotate(script) {
    const { defs, exp } = ___parse(script);
    const { codes, representatives } = finalize(defs.codes);

    const rels = {...defs.rels, "__main__": [exp]};

    const pats = patterns(codes, representatives, rels);
   
    return {rels,codes,representatives, ...pats}
  }
  annotate.doc = "Annotate all the script expressions with patterns";

  var k = { compile, run: runScriptOnData, parse: ___parse, annotate };

  function executeCode(code,data={}) {
    try {
      return k.run(code,data);
    } catch (error) {
      return `Error: ${error.message}`;
    }
  }

  exports.executeCode = executeCode;

  return exports;

})({});
