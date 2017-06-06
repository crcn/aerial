import { expect } from "chai";
import { 
  parseCSSDeclValue, 
  BUILTIN_CSS_COLOR_MAP, 
  evaluateCSSDeclValue, 
  SyntheticCSSColor, 
  CSS_FILTER_TYPES,
  SyntheticCSSFilter,
  SyntheticCSSMeasurment, 
  CSSDeclLiteralExpression,
  SyntheticCSSLinearGradient,
  SyntheticCSSGradientColorStop, 
} from "./index";

describe(__filename + "#", () => {
  it("can evaluate a hex color", () => {
    const [color] = evaluateCSSDeclValue(parseCSSDeclValue("#F60")) as [SyntheticCSSColor];
    expect(color).to.be.an.instanceOf(SyntheticCSSColor);
    expect(color.r).to.equal(255);
    expect(color.g).to.equal(102);
    expect(color.b).to.equal(0);
    expect(color.a).to.equal(1);
  });
  it("can evaluate an rgba color", () => {
    const [color] = evaluateCSSDeclValue(parseCSSDeclValue("rgba(255, 0, 255, 0.5)")) as [SyntheticCSSColor];
    expect(color).to.be.an.instanceOf(SyntheticCSSColor);
    expect(color.r).to.equal(255);
    expect(color.g).to.equal(0);
    expect(color.b).to.equal(255);
    expect(color.a).to.equal(0.5);
  });
  it("can evaluate an rgba color", () => {
    const [color] = evaluateCSSDeclValue(parseCSSDeclValue("rgb(255, 0, 100)")) as [SyntheticCSSColor];
    expect(color).to.be.an.instanceOf(SyntheticCSSColor);
    expect(color.r).to.equal(255);
    expect(color.g).to.equal(0);
    expect(color.b).to.equal(100);
    expect(color.a).to.equal(1);
  });

  it("can evaluate measurements", () => {
    const [measurment] = evaluateCSSDeclValue(parseCSSDeclValue("1px")) as [SyntheticCSSMeasurment];
    expect(measurment).to.be.an.instanceOf(SyntheticCSSMeasurment);
    expect(measurment.value).to.equal(1);
    expect(measurment.unit).to.equal("px");
  });

  it("can evaluate a space list", () => {
    const [thickness, style, color] = evaluateCSSDeclValue(parseCSSDeclValue("1px solid black")) as [string, string, string];
    expect(thickness).to.be.an.instanceOf(SyntheticCSSMeasurment);
    expect(style).to.equal("solid");
    expect(color).to.be.an.instanceOf(SyntheticCSSColor);
  });

  it("evaluates builtin color aliases", () => {
    for (const colorName in BUILTIN_CSS_COLOR_MAP) {
      expect(evaluateCSSDeclValue(parseCSSDeclValue(colorName))[0]).to.be.an.instanceOf(SyntheticCSSColor);
    }
  });

  it("can evaluate linear gradients without angles", () => {
    const [gradient] = evaluateCSSDeclValue(parseCSSDeclValue(`linear-gradient(red, blue)`)) as [SyntheticCSSLinearGradient];
    expect(gradient.colorStops[0].color.toHex()).to.equal("#FF0000");
    expect(gradient.colorStops[1].color.toHex()).to.equal("#0000FF");
    expect(gradient.angle).to.equal(0);
  });

  it("can parse more than two color stops", () => {
    const [gradient] = evaluateCSSDeclValue(parseCSSDeclValue(`linear-gradient(red, rgb(0, 255, 0) 50%, blue)`)) as [SyntheticCSSLinearGradient];
    expect(gradient.colorStops[0].color.toHex()).to.equal("#FF0000");
    expect(gradient.colorStops[1].color.toHex()).to.equal("#00FF00");
    expect(gradient.colorStops[1].stop).to.equal(0.5);
    expect(gradient.colorStops[2].color.toHex()).to.equal("#0000FF");
    expect(gradient.toString()).to.equal("linear-gradient(red, lime 50%, blue)");
  });

  describe("filters", () => {
    it("can evaluate CSS filters", () => {
      for (const filterType of CSS_FILTER_TYPES) {
        const [filter] = evaluateCSSDeclValue(parseCSSDeclValue(`${filterType}(5px)`)) as [SyntheticCSSFilter];
        expect(filter).to.be.an.instanceof(SyntheticCSSFilter);
      }
    });
  });
});

