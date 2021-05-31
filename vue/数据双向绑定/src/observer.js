/**
  * 循环遍历数据对象的每个属性
  */
// function observable(obj) {
//   if (!obj || typeof obj !== 'object') {
//       return;
//   }
//   let keys = Object.keys(obj);
//   keys.forEach((key) => {
//       defineReactive(obj, key, obj[key])
//   })
//   return obj;
// }

function Observer(data) {
  this.data = data;
  this.walk(data);
}

Observer.prototype = {
  walk: function(data) {
      var self = this;
      Object.keys(data).forEach(function(key) {
          self.defineReactive(data, key, data[key]);
      });
  },
  defineReactive: function(data, key, val) {
      var dep = new Dep();
      var childObj = observe(val);
      Object.defineProperty(data, key, {
          enumerable: true,
          configurable: true,
          get: function getter () {
            if (Dep.target) {
                dep.addSub(Dep.target);
            }
            return val;
          },
          set: function setter (newVal) {
            if (newVal === val) {
                return;
            }
            val = newVal;
            dep.notify();
          }
      });
  }
};

function observe(value, vm) {
  if (!value || typeof value !== 'object') {
      return;
  }
  return new Observer(value);
};

/**
* 将对象的属性用 Object.defineProperty() 进行设置
*/
// function defineReactive(data, key, val) {
// 	var dep = new Dep();
// 	Object.defineProperty(data, key, {
// 		enumerable: true,
// 		configurable: true,
// 		get: function getter () {
// 			if (Dep.target) {
// 				dep.addSub(Dep.target);
// 			}
// 			return val;
// 		},
// 		set: function setter (newVal) {
// 			if (newVal === val) {
// 				return;
// 			}
// 			val = newVal;
// 			dep.notify();
// 		}
// 	});
// }


function Dep () {
  this.subs = [];
}
Dep.prototype = {
  addSub: function(sub) {
    this.subs.push(sub);
  },
  notify: function() {
    this.subs.forEach(function(sub) {
        sub.update();
    });
  }
};
Dep.target = null;

exports.observe = observe;
exports.Dep = Dep;