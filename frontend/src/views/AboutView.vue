<script setup>
import NavBar from '../components/NavBar.vue';
import FooterSection from '../components/FooterSection.vue';
</script>

<template>
  <NavBar />
  <section>
    <div class="container mt-20 md:mt-24 flex flex-col items-center mb-24 md:mb-32 px-6">
      <div>
        <span class="text-4xl md:text-5xl text-orange-600 font-Lucky ml-2">C</span>
        <span class="text-4xl md:text-5xl text-slate-800 font-Lucky">NOTE</span>
      </div>
      <h2 class="font-Poppins text-md md:text-xl mt-2 text-gray-500">- A Smarter Way to Learn -</h2>
      <div class="grid mt-12 md:mt-16 grid-cols-1 grid-rows-8 md:grid-cols-2 md:grid-rows-4 gap-y-14 gap-x-24 md:gap-y-36 font-Poppins text-gray-600 items-center">
        <article class="row-start-2 md:row-start-1 md:col-start-1">
          <h2 class="text-2xl md:text-3xl font-bold text-slate-800 mb-3">The Cornell Note-Taking System</h2>
          <p>
            The <strong>Cornell Method</strong> is a structured way to take notes that improves
            <em>comprehension and retention</em>. It divides your notes into three sections:
          </p>
          <ul class="list-disc pl-6">
            <li><strong>Cue Column (Left):</strong> Write down keywords, questions, or prompts.</li>
            <li><strong>Notes Section (Right):</strong> Record main ideas in a structured way.</li>
            <li>
              <strong>Summary Section (Bottom):</strong> Summarize key takeaways in a few sentences.
            </li>
          </ul>
          <p>
            This system helps organize thoughts effectively, making it easier to review and recall
            important information.
          </p>
        </article>
        <img src="../assets/img/cornell.png" alt="Illustration" class="row-start-1 md:row-start-1 md:col-start-2 w-5/6 place-self-center"/>


        <article class="row-start-4 md:row-start-2 md:col-start-2">
          <h2 class="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Why Note-Taking is Essential</h2>
          <p>
            Effective note-taking improves <strong>learning, productivity, and memory</strong>.
            Writing things down enhances understanding and helps with long-term retention. Whether
            you're a <em>student, professional, or lifelong learner</em>, well-organized notes help
            you:
          </p>
          <ul class="list-disc pl-6">
            <li>Clarify complex concepts.</li>
            <li>Track progress efficiently.</li>
            <li>Recall ideas faster with structured notes.</li>
          </ul>
          <p>
            A structured system like <strong>Cornell Notes</strong> transforms scattered thoughts
            into a <em>clear, searchable knowledge base</em>.
          </p>
        </article>
        <img src="../assets/img/notes.png" alt="Illustration" class="row-start-3 md:row-start-2 md:col-start-1 w-5/6 place-self-center opacity-90"/>


        <article class="row-start-6 md:row-start-3 md:col-start-1">
          <h2 class="text-2xl md:text-3xl font-bold text-slate-800 mb-2">What is <span class="text-bookmark-purple">C</span>Note?</h2>
          <p>
            <strong>CNote</strong> is a <em>modern note-taking application</em> designed to help you
            stay organized and focused. Inspired by the <strong>Cornell System</strong>, our tool
            allows you to:
          </p>
          <ul class="list-disc pl-6">
            <li>
              Take <strong>structured notes</strong> with dedicated sections for organization.
            </li>
            <li>Use a <strong>folder system</strong> to manage topics efficiently.</li>
            <li>Edit notes in a <strong>WYSIWYG editor</strong> for rich text formatting.</li>
            <li>Access your notes <strong>anytime, anywhere</strong> with cloud syncing.</li>
          </ul>
        </article>
        <img src="../assets/img/notes2.png" alt="Illustration" class="row-start-5 md:row-start-3 md:col-start-2 w-5/6 place-self-center opacity-90"/>


        <article class="row-start-8 md:row-start-4 md:col-start-2">
          <h2 class="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Features That Make <span class="text-bookmark-purple">C</span>Note Unique</h2>
          <ul class="list-disc pl-6">
            <li><strong>Organized Folder System:</strong> Categorize notes seamlessly.</li>
            <li>
              <strong>Cornell Technique Layout:</strong> Structured sections for better learning.
            </li>
            <li><strong>A Simple Editor:</strong> Format notes without complex markdown.</li>
            <li><strong>Cloud Access:</strong> Work from any device, anywhere.</li>
          </ul>
          <p>
            <strong>CNote</strong> simplifies
            <em>learning, productivity, and knowledge retention</em>, making it the perfect tool for
            students and professionals.
          </p>
        </article>
        <img src="../assets/img/logo.png" alt="Illustration" class="row-start-7 md:row-start-4 md:col-start1 w-3/4 place-self-center opacity-80"/>
      </div>
    </div>
  </section>
  <FooterSection />
</template>
