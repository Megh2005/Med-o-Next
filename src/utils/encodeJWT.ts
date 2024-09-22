const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

export default secretKey;
