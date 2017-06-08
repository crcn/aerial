import { expect } from "chai";
import { SyntheticCSSStyleGraphics, SyntheticCSSStyle } from "../";

describe(__filename + "#", () => {
  it("can be created", () => {
    const graphics = new SyntheticCSSStyleGraphics(SyntheticCSSStyle.fromObject({ background: "black" }));
  });

  describe("background colors", () => {

    it("adds a background object from background-color", () => {
      const graphics = new SyntheticCSSStyleGraphics(SyntheticCSSStyle.fromObject({ backgroundColor: "black" }));
      expect(graphics.backgrounds.length).to.equal(1);
      expect(graphics.primaryBackground.color.toHex()).to.equal("#000000");
    });

    it("adds a background object from background-repeat", () => {
      const graphics = new SyntheticCSSStyleGraphics(SyntheticCSSStyle.fromObject({ backgroundRepeat: "no-repeat" }));
      expect(graphics.backgrounds.length).to.equal(1);
      expect(graphics.primaryBackground.repeat).to.equal("no-repeat");
    });

    it("adds a background object from background-image", () => {
      const graphics = new SyntheticCSSStyleGraphics(SyntheticCSSStyle.fromObject({ backgroundImage: "url(path.png)" }));
      expect(graphics.primaryBackground.image).to.equal("path.png");
    });

    it("adds a background object from background-position", () => {
      const graphics = new SyntheticCSSStyleGraphics(SyntheticCSSStyle.fromObject({ backgroundPosition: "center" }));
      expect(graphics.primaryBackground.position.top.value).to.equal(0.5);
      expect(graphics.primaryBackground.position.left.value).to.equal(0.5);
    });

    it("adds a background object from background", () => {
      const graphics = new SyntheticCSSStyleGraphics(SyntheticCSSStyle.fromObject({ background: "#F60 url(test.png) center repeat-y" }));
      const background = graphics.primaryBackground;
      expect(background.color.toHex()).to.equal("#FF6600");
      expect(background.image).to.equal("test.png");
      expect(background.position.top.value).to.equal(0.5);
      expect(background.position.left.value).to.equal(0.5);
      expect(background.repeat).to.equal("repeat-y");
    });

    it("can add multiple backgrounds", () => {
      const graphics = new SyntheticCSSStyleGraphics(SyntheticCSSStyle.fromObject({ background: "#F60, #F0F" }));
      const backgrounds = graphics.backgrounds;
      expect(backgrounds.length).to.equal(2);
      expect(backgrounds[0].color.toHex()).to.equal("#FF6600");
      expect(backgrounds[1].color.toHex()).to.equal("#FF00FF");
    });

    it("can be converted back to the original style", () => {
      const graphics = new SyntheticCSSStyleGraphics(SyntheticCSSStyle.fromObject({ 
        backgroundColor: "orange",
        backgroundPosition: "center"
      }));

      expect(graphics.primaryBackground.color.toHex()).to.equal("#FFA500");
      graphics.primaryBackground.color.b = 100;
      expect(graphics.primaryBackground.position.top.value).to.equal(0.5);

      expect(graphics.toStyle().toObject()).to.eql({
        background: "#FFA564 center"
      })
    });
  });

  describe("box shadows", () => {
    it("can add a single box shadow", () => {
      const graphics = new SyntheticCSSStyleGraphics(SyntheticCSSStyle.fromObject({ boxShadow: "0 1 2 3 #F60" }));
      expect(graphics.boxShadows.length).to.equal(1);
      const boxShadow = graphics.boxShadows[0];
      expect(boxShadow.x.value).to.equal(0);
      expect(boxShadow.y.value).to.equal(1);
      expect(boxShadow.blur.value).to.equal(2);
      expect(boxShadow.spread.value).to.equal(3);
      expect(boxShadow.color.toHex()).to.equal("#FF6600");
    });
    
    it("can be converted back to the original style", () => {
      const graphics = new SyntheticCSSStyleGraphics(SyntheticCSSStyle.fromObject({ 
        boxShadow: "inset 5 4 3 2 orange"
      }));

      expect(graphics.toStyle().toObject()).to.eql({
        boxShadow: "inset 5px 4px 3px 2px orange"
      })
    });
  });

  describe("filters", () => {
    it("can add multiple filters", () => {
      const graphics = new SyntheticCSSStyleGraphics(SyntheticCSSStyle.fromObject({ filter: "contrast(175%) brightness(3%)" }));
      expect(graphics.filters.length).to.equal(2);
    });
  });


  // describe("borders", () => {
  //   it("can add add a border", () => {
  //     const graphics = new SyntheticCSSStyleGraphics(SyntheticCSSStyle.fromObject({ borderLeft: "1px" }));
  //     expect(graphics.border.leftWidth.value).to.equal(1);
  //     const graphics2 = new SyntheticCSSStyleGraphics(SyntheticCSSStyle.fromObject({ borderBottom: "black solid 5px" }));
  //     expect(graphics2.border.bottomWidth.value).to.equal(5);
  //     expect(graphics2.border.bottomColor.toString()).to.equal("black");
  //     expect(graphics2.border.bottomStyle.toString()).to.equal("solid");

  //     const graphics3 = new SyntheticCSSStyleGraphics(SyntheticCSSStyle.fromObject({ borderWidth: "3px" }));
  //     expect(graphics3.border.bottomWidth.value).to.equal(3);
  //     expect(graphics3.border.topWidth.value).to.equal(3);
  //     expect(graphics3.border.rightWidth.value).to.equal(3);
  //     expect(graphics3.border.leftWidth.value).to.equal(3);
  //   });

  //   it("returns style properties according to the variances in width/color/style", () => {
  //     const graphics = new SyntheticCSSStyleGraphics(SyntheticCSSStyle.fromObject({ borderTop: "2px solid black", borderRight: "3px solid black", borderLeft: "1px solid black", borderBottom: "4px solid black" }));
      
  //   });
  // });

  // describe("boxes", () => {
  //   it("can add padding with 2 params", () => {
  //     const graphics = new SyntheticCSSStyleGraphics(SyntheticCSSStyle.fromObject({ padding: "2px 4px" }));
  //     expect(graphics.padding.leftWidth.value).to.equal(4);
  //     expect(graphics.padding.rightWidth.value).to.equal(4);
  //     expect(graphics.padding.topWidth.value).to.equal(2);
  //     expect(graphics.padding.bottomWidth.value).to.equal(2);
  //   });


  //   it("can add padding with 4 params", () => {
  //     const graphics = new SyntheticCSSStyleGraphics(SyntheticCSSStyle.fromObject({ padding: "1px 2px 3px 4px" }));
  //     expect(graphics.padding.topWidth.value).to.equal(1);
  //     expect(graphics.padding.rightWidth.value).to.equal(2);
  //     expect(graphics.padding.bottomWidth.value).to.equal(3);
  //     expect(graphics.padding.leftWidth.value).to.equal(4);
  //   });

  // });
});

