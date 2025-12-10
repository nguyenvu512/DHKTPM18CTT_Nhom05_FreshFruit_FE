export default function MoneyFormat(x) {
    if (typeof x !== "number" || isNaN(x)) {
      return "0";
    }
    return x.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }