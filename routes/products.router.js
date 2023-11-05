import express from "express";
import { Product } from "../schemas/products.schema.js";
import { connect } from "../schemas/index.js";
const router = express.Router();
connect();

// 상품 등록
router.post("/products", async (req, res) => {
  const { title, content, author, password } = req.body;
  try {
    const newGoods = {
      title,
      content,
      author,
      password,
      status: "FOR_SALE",
    };
    await Product.create(newGoods);
    res.json({
      message: "판매 상품을 등록하였습니다.",
    });
  } catch (e) {
    res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }
});

//상품 목록 조회
router.get("/products", async (req, res) => {
  try {
    const product = [];
    const products = await Product.find().sort({ createdAt: -1 });
    for (let data of products) {
      const temp = {
        _id: data._id,
        title: data.title,
        author: data.author,
        status: data.status,
        createdAt: data.createdAt,
      };
      product.push(temp);
    }
    res.json(product);
  } catch (e) {
    console.error(e);
  }
});

// 입력 값 없는 경우
router.get("/product/", async (req, res) => {
  return res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
});

// 특정 상세 조회
router.get("/product/:productId", async (req, res) => {
  const _id = req.params.productId;
  try {
    const goodsOne = await Product.findOne({ _id });
    const detailOne = {
      _id: goodsOne._id,
      title: goodsOne.title,
      content: goodsOne.content,
      author: goodsOne.author,
      status: goodsOne.status,
      createdAt: goodsOne.createdAt,
    };
    res.json(detailOne);
  } catch (e) {
    if (e.name === "CastError") return res.status(404).send({ message: "상품 조회에 실패하였습니다." });
    console.log(e);
  }
});

// 입력 값 없는 경우
router.put("/products/:productId", async (req, res) => {
  return res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
});

//상품 정보 수정
router.put("/products/:productId", async (req, res) => {
  const { title, content, password, status } = req.body;
  const id = req.params.productId;

  if (!title && !content && !status && !password) {
    return res.status(400).send({ message: "데이터 형식이 올바르지 않습니다." });
  }

  try {
    const goodsOne = await Product.findOne({ _id: id });
    if (password !== goodsOne.password) {
      return res.status(401).send({ message: "상품을 수정할 권한이 존재하지 않습니다." });
    }

    const putOne = {
      title: title ? title : goodsOne.title,
      content: content ? content : goodsOne.content,
      password: password ? password : goodsOne.password,
      status: status ? status : goodsOne.status,
    };

    await Product.updateOne({ _id: id }, { $set: putOne });

    res.json("수정완료");
  } catch (e) {
    if (e.name === "CastError") return res.status(404).send({ message: "상품 조회에 실패하였습니다." });
  }
});

// 상품 정보 삭제
router.delete("/products/:productId", async (req, res) => {
  const { password } = req.body;
  const id = req.params.productId;
  if (!password) {
    return res.status(400).send({ message: "데이터 형식이 올바르지 않습니다." });
  }

  try {
    const goodsOne = await Product.findOne({ _id: id });
    if (password !== goodsOne.password) {
      return res.status(401).send({ message: "상품을 수정할 권한이 존재하지 않습니다." });
    }
    await Product.deleteOne({ _id: id });
    res.json("삭제완료!");
  } catch (e) {
    if (e.name === "CastError") return res.status(404).send({ message: "상품 조회에 실패하였습니다." });
  }
});
export default router;
