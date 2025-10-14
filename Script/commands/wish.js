module.exports.config = {
  'name': "wish",
  'version': "1.0.0",
  'hasPermssion': 0x0,
  'credits': "nazrul",
  'description': "Happy birthday wish for your friends",
  'commandCategory': "M H BD",
  'usages': "@tag",
  'dependencies': {
    'axios': '',
    'fs-extra': ''
  },
  'cooldowns': 0x0
};
module.exports.wrapText = (_0x29978c, _0x4ad966, _0x4d5f11) => {
  return new Promise(_0x7f5072 => {
    if (_0x29978c.measureText(_0x4ad966).width < _0x4d5f11) {
      return _0x7f5072([_0x4ad966]);
    }
    if (_0x29978c.measureText('W').width > _0x4d5f11) {
      return _0x7f5072(null);
    }
    const _0x7ffe5b = _0x4ad966.split(" ");
    const _0x8a7eec = [];
    let _0x52efd0 = '';
    while (_0x7ffe5b.length > 0) {
      let _0x2ddbdd = false;
      while (_0x29978c.measureText(_0x7ffe5b[0]).width >= _0x4d5f11) {
        const _0x177fef = _0x7ffe5b[0];
        _0x7ffe5b[0] = _0x177fef.slice(0, -1);
        if (_0x2ddbdd) {
          _0x7ffe5b[1] = '' + _0x177fef.slice(-1) + _0x7ffe5b[1];
        } else {
          _0x2ddbdd = true;
          _0x7ffe5b.splice(1, 0, _0x177fef.slice(-1));
        }
      }
      if (_0x29978c.measureText('' + _0x52efd0 + _0x7ffe5b[0]).width < _0x4d5f11) {
        _0x52efd0 += _0x7ffe5b.shift() + " ";
      } else {
        _0x8a7eec.push(_0x52efd0.trim());
        _0x52efd0 = '';
      }
      if (_0x7ffe5b.length === 0) {
        _0x8a7eec.push(_0x52efd0.trim());
      }
    }
    return _0x7f5072(_0x8a7eec);
  });
};
module.exports.run = async function ({
  args: _0x23530f,
  Users: _0x36d5ac,
  Threads: _0x16ef3b,
  api: _0x1ee445,
  event: _0x10bfb0,
  Currencies: _0x558a01
}) {
  const {
    loadImage: _0x4babdc,
    createCanvas: _0x2258da
  } = require("canvas");
  const _0x285964 = global.nodemodule["fs-extra"];
  const _0x1743af = global.nodemodule.axios;
  let _0x3af5c6 = __dirname + "/cache/background.png";
  let _0x366e3f = __dirname + "/cache/Avtmot.png";
  var _0x5a0182 = Object.keys(_0x10bfb0.mentions)[0] || _0x10bfb0.senderID;
  var _0x1a030b = await _0x36d5ac.getNameUser(_0x5a0182);
  var _0x7259a7 = ["https://i.postimg.cc/k4RS69d8/20230921-195836.png"];
  var _0xcb8b46 = _0x7259a7[Math.floor(Math.random() * _0x7259a7.length)];
  let _0x2ac756 = (await _0x1743af.get("https://graph.facebook.com/" + _0x5a0182 + "/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662", {
    'responseType': "arraybuffer"
  })).data;
  _0x285964.writeFileSync(_0x366e3f, Buffer.from(_0x2ac756, "utf-8"));
  let _0x163ded = (await _0x1743af.get('' + _0xcb8b46, {
    'responseType': "arraybuffer"
  })).data;
  _0x285964.writeFileSync(_0x3af5c6, Buffer.from(_0x163ded, "utf-8"));
  let _0x59b020 = await _0x4babdc(_0x3af5c6);
  let _0x2338e9 = await _0x4babdc(_0x366e3f);
  let _0x262bd7 = _0x2258da(_0x59b020.width, _0x59b020.height);
  let _0xcc1c8c = _0x262bd7.getContext('2d');
  _0xcc1c8c.drawImage(_0x59b020, 0, 0, _0x262bd7.width, _0x262bd7.height);
  _0xcc1c8c.font = "400 32px Arial";
  _0xcc1c8c.fillStyle = "#1878F3";
  _0xcc1c8c.textAlign = "start";
  const _0x3d624d = await this.wrapText(_0xcc1c8c, _0x1a030b, 1160);
  _0xcc1c8c.fillText(_0x3d624d.join("\n"), 120, 727);
  _0xcc1c8c.beginPath();
  _0xcc1c8c.drawImage(_0x2338e9, 70, 270, 400, 400);
  const _0x33b1a8 = _0x262bd7.toBuffer();
  _0x285964.writeFileSync(_0x3af5c6, _0x33b1a8);
  _0x285964.removeSync(_0x366e3f);
  return _0x1ee445.sendMessage({
    'body': " \uD83C\uDF82\uD83C\uDF82\uD83C\uDF82\uD83C\uDF82 \u09B6\u09C1\u09AD \u099C\u09A8\u09CD\u09AE\u09A6\u09BF\u09A8 \u0995\u09B2\u09BF\u099C\u09BE \uD83C\uDF82\uD83C\uDF82\uD83C\uDF82\uD83C\uDF82\n           \u2588\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2588\n           \uD83D\uDC9B\u2749 \u2564\u2564\u2564\u2564 \u273F \u2564\u2564\u2564\u2564 \u2749\uD83D\uDC9B\n                \uD835\uDC07\uD835\uDC00\uD835\uDC0F\uD835\uDC0F\uD835\uDC18 \uD835\uDC01\uD835\uDC08\uD835\uDC11\uD835\uDC13\uD835\uDC07\uD835\uDC03\uD835\uDC00\uD835\uDC18\n       \u2749 \u2567\u2567\u2567{ " + _0x1a030b + " }\u2567\u2567\u2567 \u2749\n_______________________________________\n\uD83C\uDF40\uD83C\uDF40#___\u0985\u09A8\u09C7\u0995__\u0985\u09A8\u09C7\u0995___\u09B6\u09C1\u09AD\u09C7\u099A\u09CD\u099B\u09BE\uD83C\uDF40\uD83C\uDF40\n\uD83C\uDF6B\u09B8\u09C1\u09A8\u09CD\u09A6\u09B0 \u0993 \u09AA\u09CD\u09B0\u09BE\u09A3\u09AC\u09A8\u09CD\u09A4 \u09B9\u09CB\u0995 \u09A4\u09CB\u09AE\u09BE\u09B0 \u0986\u0997\u09BE\u09AE\u09C0 \u09A6\u09BF\u09A8 \u0997\u09C1\u09B2\u09CB\n\n\u250F\u2513\u250F\u2513\uD83C\uDF88\n\u2503\u2517\u251B\u1D00\u1D18\u1D18\u028F_\uD83C\uDF82\uD83C\uDF86\uD83C\uDF89\n\u2503\u250F\u2513\u2503\u3000\uD83C\uDD31\uD83C\uDD38\uD83C\uDD41\uD83C\uDD43\uD83C\uDD37\uD83C\uDD33\uD83C\uDD30\uD83C\uDD48\uD83C\uDF89\uD83C\uDF86\uD83C\uDF87\n\u2517\u251B\u2517\u251B      \n\n....\u2763I want to wish you all the love and\n happiness in the world,,,, \uD83D\uDC9E\uD83D\uDC9E \n  All of which your deserve...... \uD83D\uDC9D\uD83D\uDC9D\n\n  #happiness \uD83D\uDE18\n   #happyday\uD83D\uDC9C\n  #birthdaycake\uD83C\uDF82\uD83E\uDD21\n  #birthdaywishes\uD83D\uDE0D\uD83D\uDE18\uD83C\uDF70\uD83D\uDC90\n  #birthdaywishesfriend\uD83E\uDD2F\uD83C\uDF82\n\uD83C\uDF39\uD83C\uDF39\uD83C\uDF39\uD83C\uDF39\uD83C\uDF39\uD83C\uDF39\uD83C\uDF39\uD83C\uDF39\uD83C\uDF39\uD83C\uDF39\uD83C\uDF39\uD83C\uDF39\uD83C\uDF39\uD83C\uDF39\uD83C\uDF39\n\nWiSh BY " + global.config.BOTNAME + " \u300E\uD83E\uDD16\uD83D\uDDA4\u300F  ",
    'attachment': _0x285964.createReadStream(_0x3af5c6)
  }, _0x10bfb0.threadID, () => _0x285964.unlinkSync(_0x3af5c6), _0x10bfb0.messageID);
};
