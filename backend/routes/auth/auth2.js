const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Start OAuth flow
router.get("/google", (req, res, next) => {
  console.log("🚀 Starting Google OAuth flow...");
  next();
}, passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback URL
router.get("/google/callback", (req, res, next) => {
  console.log("📞 Google OAuth callback received");
  next();
}, passport.authenticate("google", { failureRedirect: "http://localhost:3000/login?error=oauth_failed" }),
  (req, res) => {
    try {
      console.log("✅ OAuth successful, user:", req.user);
      
      if (!req.user) {
        console.error("No user found after OAuth");
        return res.redirect("http://localhost:3000/login?error=no_user");
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: req.user.id, 
          email: req.user.email, 
          role: req.user.role 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
      );

      // Set JWT in HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Redirect to frontend with success
      const frontendUrl = `http://localhost:3000/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
      }))}`;
      
      res.redirect(frontendUrl);
    } catch (error) {
      console.error("Error in OAuth callback:", error);
      res.redirect("http://localhost:3000/login?error=callback_error");
    }
  }
);

// Logout (compatible with both session and token)
router.get("/logout", (req, res) => {
  // Clear session if it exists
  if (req.logout) {
    req.logout((err) => {
      if (err) console.error("Session logout error:", err);
    });
  }
  
  // Clear JWT cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  
  res.redirect("http://localhost:3000/login");
});

module.exports = router;