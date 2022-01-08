myDiagram.groupTemplateMap.add("Ref",
  $$(go.Group, "Vertical", {
      locationSpot: go.Spot.Top,
      locationObjectName: "demo2",
      //minLocation: new go.Point(NaN, NaN),
      maxLocation: new go.Point(9999, 9999),
      selectionObjectName: "demo2",
      resizable: true,
      resizeObjectName: "demo2",
      doubleClick: function (e, node) {
        let url = '?name=' + node.data.name + '&ref=' + node.data.reference;
        let nd = myDiagram.model.nodeDataArray;
        layer.open({
          type: 2,
          title: 'Reference Fragment',
          //shadeClose: true,
          shade: 0.8,
          resize: false,
          area: ['400px', '350px'],
          content: ['./html/fragment_ref.html' + url],
          btn: ['OK', 'cancel'],
          yes: function (index, layero) {
            layer.close(index);
            var submit = layero.find('iframe').contents();
            var ref = submit.find('#ref')[0].value;
            var name = submit.find('#name')[0].value;
            myDiagram.model.setDataProperty(node.data, 'reference', ref);
            myDiagram.model.setDataProperty(node.data, 'name', name);
          },
          btn2: function (index, lo) {
            layer.close(index);
          }
        });
      }
    },
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    $$(go.Panel, "Horizontal",
      $$(go.Panel, "Auto",
        $$(go.Shape, "Rectangle", {
            name: "demo2"
          }, {
            width: 300,
            height: 150,
            fill: null,
            stroke: 'darkcyan',
            strokeWidth: 3,

          },
          new go.Binding("width", "width").makeTwoWay(),
          new go.Binding("height", "height").makeTwoWay(),
          new go.Binding('minSize', 'minsize', function (e) {
            return new go.Size(e[0], e[1]);
          }).makeTwoWay(),
        ),
        $$(go.Panel, 'Auto', {
            alignment: new go.Spot(0, 0)
          },
          $$(go.Shape, {
              name: "SHAPE",
              fill: $$(go.Brush, "Linear", {
                0.0: "white",
                1.0: "cyan"
              }),
              desiredSize: new go.Size(60, 20),
              alignment: go.Spot.TopLeft
            },
            new go.Binding("figure", "fig"),
            new go.Binding("parameter1", "p1"),
            new go.Binding('desiredSize', '', function (e) {
              let len = e.name.length + 7;
              return new go.Size(len * 7.5, 20);
            }).makeTwoWay(go.Size.stringify)
          ),
          $$(go.Panel, 'Horizontal',
            $$(go.TextBlock, {
                text: "",
                editable: false,
                name: "AAA",
              },
              new go.Binding("text", "type").makeTwoWay(),
            ),
            $$(go.TextBlock, {
              editable: false,
              text: " ",
            }),
            $$(go.TextBlock, {
                editable: true,
                text: "name",
              },
              new go.Binding('text', 'name').makeTwoWay()),
          )
        ),
        $$(go.TextBlock, {
            editable: false,
            name: "con",
            alignment: go.Spot.Center,
            font: "400 16pt Source Sans Pro, sans-serif"
          },
          new go.Binding("text", "reference", function (e) {
            return e
          }).makeTwoWay(function (e, v, m) {
            m.setDataProperty(v, 'text', e)
          }),
          new go.Binding('text', 'reference').makeTwoWay()
        ),
      ),
      $$(go.Panel, "Vertical", {
          alignment: go.Spot.Top,
          margin: new go.Margin(0, 0, 0, 10),
          visible: false,
          name: '_fragment_'
        },
        new go.Binding('visible', 'vis').makeTwoWay(),
        $$(go.Picture, {
            height: 16,
            width: 16,
            source: 'gojs/images/leftNavIcon/lock-off.png',
            click: function (e, v) {
              let d = v.part.data;
              let src = d.status; // src->true :locked false:unlock
              let nodedata = myDiagram.model.nodeDataArray;
              let linkdata = myDiagram.model.linkDataArray;
              myDiagram.model.setDataProperty(d, 'status', !src);
              let nodes = getNodesByLoc(d);
              let pos = new go.Point.parse(d.loc);
              //cycle_data.push({ key: d.key, data: nodes });
              last_move_info.push({
                key: d.key,
                loc: d.loc,
                change: false
              });
              let pos_y = pos.y;
              let arr_node = [];
              let arr_link = [];
              for (var k in nodedata) {
                let dd = nodedata[k];

                if (dd.group) {
                  let curr_y = convertTimeToY(dd.start) + computeActivityHeight(dd.duration);
                  if (curr_y > pos_y) {
                    arr_node.push(dd)
                  }
                } else if (dd.category === 'Fragment' && dd.key !== d.key) {
                  let _pos_ = new go.Point.parse(dd.loc);
                  let h = dd.height;
                  if (_pos_.y > pos_y) {
                    arr_node.push(dd);
                  }
                }
              }
              for (var k in linkdata) {
                let dd = linkdata[k];
                if (convertTimeToY(dd.time) > pos_y) {
                  arr_link.push(dd)
                }
              }
              cycle_data.push({
                key: d.key,
                arr_node: arr_node,
                arr_link: arr_link,
                data: nodes
              });

              let limit = getLimit(nodes);
              if (d.status) { //当锁定的时候，要设置最小的尺寸并且限定其位置为垂直方向
                setMinSize(limit, d, true, nodes);
                setLocation(limit, d, true);

              } else {
                //myDiagram.model.setDataProperty(d, 'movOnly', false);
                setLocation({}, d, false);
                setMinSize({}, d, false);
              }

            }
          },
          new go.Binding("source", "status", function (e) {
            if (!e) {
              return 'gojs/images/leftNavIcon/lock-off.png' //locked
            } else {
              return 'gojs/images/leftNavIcon/lock.png' //unlock
            }
          })
        ),
        $$(go.Picture, {
          height: 16,
          width: 16,
          source: 'gojs/images/image/window.png',
          margin: new go.Margin(5, 0, 0, 0),
          click: function (e, v) {
            let data = v.part.data;
            if (data.type === 'ref') {
              let url = '?ref=' + data.reference;
              layer.open({
                type: 2,
                title: 'Reference Diagram --' + data.reference,
                //shadeClose: true,
                shade: 0.8,
                resize: false,
                area: ['900px', '600px'],
                content: ['./html/ref_diagram.html' + url, 'no'],
                btn: ['OK'],
                yes: function (index, layero) {
                  layer.close(index);
                }
              })
            }
            // removeNodeData(data);
          }
        })
      )
    ),
    new go.Binding('maxLocation', 'maxloc', function (ee) {
      if (Object.prototype.toString.call(ee) === '[object Object]') {
        return new go.Point(ee.x, 9999);
      } else {
        if (ee[1] === 'null') {
          return new go.Point(ee[0], 9999);
        } else if (ee[1] === 'free') {
          return new go.Point(9999, 9999);
        } else {
          return new go.Point(ee[0], 9999);
        }
      }


    }).makeTwoWay(),
    new go.Binding('minLocation', 'minloc', function (ee) {
      if (Object.prototype.toString.call(ee) === '[object Object]') {
        return new go.Point(ee.x, -9999);
      } else {

        if (ee[1] === 'null') {
          return new go.Point(ee[0], -9999);
        } else if (ee[1] === 'free') {
          return new go.Point(-9999, -9999);
        } else {
          return new go.Point(ee[0], ee[1]);
        }
      }
    }).makeTwoWay()
  )
);

myDiagram.groupTemplateMap.add("Fragment",
    $$(go.Group, "Vertical", {
        locationSpot: go.Spot.Top,
        locationObjectName: "demo2",
        //minLocation: new go.Point(NaN, NaN),
        maxLocation: new go.Point(9999, 9999),
        selectionObjectName: "demo2",
        resizable: true,
        resizeObjectName: "demo2",
        // doubleClick: function(e, part) {
        //     //console.log(part.data)
        //     myDiagram.model.addNodeData({ group: part.data.key, category: 'fragpart', width: 50 });

        //     myDiagram.commitTransaction("done");
        // }
      },
      //new go.Binding("text", "categry", function(e) { console.log(e); return e; }).makeTwoWay(),
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      $$(go.Panel, "Horizontal",
        $$(go.Panel, "Auto",
          $$(go.Shape, "Rectangle", {
              name: "demo2"
            }, {
              width: 300,
              height: 150,
              fill: null,
              stroke: 'darkcyan',
              strokeWidth: 3
            },
            new go.Binding("width", "width").makeTwoWay(),
            new go.Binding("height", "height").makeTwoWay(),
            new go.Binding('minSize', 'minsize', function (e) {
              return new go.Size(e[0], e[1]);
            }).makeTwoWay(),
          ),
          $$(go.Panel, 'Auto', {
              alignment: new go.Spot(0, 0)
            },
            $$(go.Shape, {
                name: "SHAPE",
                fill: $$(go.Brush, "Linear", {
                  0.0: "white",
                  1.0: "cyan"
                }),
                desiredSize: new go.Size(60, 20),
                alignment: go.Spot.TopLeft
              },
              new go.Binding("figure", "fig"),
              new go.Binding("parameter1", "p1"),
              new go.Binding('desiredSize', '', function (e) {
                let len = e.name.length + 7;
                return new go.Size(len * 7.5, 20);
              }).makeTwoWay(go.Size.stringify)
            ),
            $$(go.Panel, 'Horizontal',
              $$(go.TextBlock, {
                  text: "",
                  editable: false,
                  name: "AAA",
                },
                new go.Binding("text", "type").makeTwoWay(),
              ),
              $$(go.TextBlock, {
                editable: false,
                text: " ",
              }),
              $$(go.TextBlock, {
                  editable: true,
                  text: "name",
                },
                new go.Binding('text', 'name').makeTwoWay()),
            )
          ),
          $$(go.TextBlock, {
              editable: true,
              name: "con",
              alignment: new go.Spot(0, 0),
              margin: new go.Margin(20, 15, 4, 5)
            },
            new go.Binding("text", "condition", function (e) {
              let pt = /\[.*\]/g
              let bool = e.match(pt) === null
              if (!bool) {
                return e
              }
              return e === '' ? '[condition]' : '[' + e + ']'
            }).makeTwoWay(function (e, v, m) {
              m.setDataProperty(v, 'text', e)
            }),
            new go.Binding('text', 'condition').makeTwoWay(),
            new go.Binding('stroke', '', function (e) {
              return e.isLegal === undefined ? 'black' : e.isLegal ? 'black' : 'red'
            }).makeTwoWay()
          ),
          // new go.Binding("text", "width", function(e) { console.log(e); return e }).makeTwoWay(function(e, v, m) {
          //     m.setDataProperty(v, 'width', e)
          // }).ofObject("demo2")
        ),
        $$(go.Panel, "Vertical", {
            alignment: go.Spot.Top,
            margin: new go.Margin(0, 0, 0, 10),
            visible: false,
            name: '_fragment_'
          },
          new go.Binding('visible', 'vis').makeTwoWay(),
          $$(go.Picture, {
              height: 16,
              width: 16,
              source: 'gojs/images/leftNavIcon/lock-off.png',
              click: function (e, v) {
                let d = v.part.data;
                let src = d.status; // src->true :locked false:unlock
                let nodedata = myDiagram.model.nodeDataArray;
                let linkdata = myDiagram.model.linkDataArray;
                myDiagram.model.setDataProperty(d, 'status', !src);
                let nodes = getNodesByLoc(d);
                let pos = new go.Point.parse(d.loc);
                //cycle_data.push({ key: d.key, data: nodes });
                last_move_info.push({
                  key: d.key,
                  loc: d.loc,
                  change: false
                });
                let pos_y = pos.y;
                let arr_node = [];
                let arr_link = [];
                for (var k in nodedata) {
                  let dd = nodedata[k];

                  if (dd.group) {
                    let curr_y = convertTimeToY(dd.start) + computeActivityHeight(dd.duration);
                    if (curr_y > pos_y) {
                      arr_node.push(dd)
                    }
                  } else if (dd.category === 'Fragment' && dd.key !== d.key) {
                    let _pos_ = new go.Point.parse(dd.loc);
                    let h = dd.height;
                    if (_pos_.y > pos_y) {
                      arr_node.push(dd);
                    }
                  }
                }
                for (var k in linkdata) {
                  let dd = linkdata[k];
                  if (convertTimeToY(dd.time) > pos_y && convertTimeToY(dd.time) < pos_y + d.height) {
                    arr_link.push(dd)
                  }
                }
                cycle_data.push({
                  key: d.key,
                  arr_node: arr_node,
                  arr_link: arr_link,
                  data: nodes
                });
                if (!src) { //locked,设置link所属的片选框，暂时只表示父级片选框，父级框不只一个
                  for (var k in arr_link) {
                    let par_frags = arr_link[k].pa_frag === undefined ? '' : arr_link[k].pa_frag
                    if (par_frags === '') {
                      myDiagram.model.setDataProperty(arr_link[k], 'pa_frag', d.key)
                    }
                  }
                } else {
                  for (var k in arr_link) {
                    myDiagram.model.setDataProperty(arr_link[k], 'pa_frag', '')
                  }
                }
                let limit = getLimit(nodes);
                if (d.status) { //当锁定的时候，要设置最小的尺寸并且限定其位置为垂直方向
                  setMinSize(limit, d, true, nodes);
                  setLocation(limit, d, true);
                } else {
                  //myDiagram.model.setDataProperty(d, 'movOnly', false);
                  setLocation({}, d, false);
                  setMinSize({}, d, false);
                }
              }
            },
            new go.Binding("source", "status", function (e) {
              if (!e) {
                return 'gojs/images/leftNavIcon/lock-off.png' //locked
              } else {
                return 'gojs/images/leftNavIcon/lock.png' //unlock
              }
            })
          ),
          $$(go.Picture, {
            height: 16,
            width: 16,
            source: 'gojs/images/leftNavIcon/add.png',
            margin: new go.Margin(5, 0, 0, 0),
            click: function (e, v) {
              let data = v.part.data;
              if (data.type !== 'alt') {
                return
              }
              // removeNodeData(data);
            }
          })
        )
      ),

      new go.Binding('maxLocation', 'maxloc', function (ee) {
        if (Object.prototype.toString.call(ee) === '[object Object]') {
          return new go.Point(ee.x, 9999);
        } else {
          if (ee[1] === 'null') {
            return new go.Point(ee[0], 9999);
          } else if (ee[1] === 'free') {
            return new go.Point(9999, 9999);
          } else {
            return new go.Point(ee[0], 9999);
          }
        }
      }).makeTwoWay(),
      new go.Binding('minLocation', 'minloc', function (ee) {
        if (Object.prototype.toString.call(ee) === '[object Object]') {
          return new go.Point(ee.x, -9999);
        } else {
          if (ee[1] === 'null') {
            return new go.Point(ee[0], -9999);
          } else if (ee[1] === 'free') {
            return new go.Point(-9999, -9999);
          } else {
            return new go.Point(ee[0], ee[1]);
          }
        }
      }).makeTwoWay()
    )
  );